
using Microsoft.AspNetCore.Mvc;
using MongoDB.Entities;
using SearchService.Models;
using SearchService.RequestHelpers;

namespace SearchService.Controller
{
    [ApiController]
    [Route("api/search")]
    public class SearchController : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<List<Item>>> SearchItems([FromQuery]SearchParams searchParams)
        {
            var query = DB.PagedSearch<Item, Item>();

            query.Sort(x => x.Ascending(i => i.Make));

            if (!string.IsNullOrEmpty(searchParams.term))
            {
                query.Match(Search.Full, searchParams.term).SortByTextScore();
            }
            query = searchParams.OrderBy switch
            {
                "make" => query.Sort(x => x.Ascending(i => i.Make)),
                "new" => query.Sort(x => x.Descending(i => i.CreatedAt)),
                _ => query.Sort(x => x.Ascending(i => i.AuctionEnd))
            };

            query = searchParams.FilterBy switch
            {
                "finished" => query.Match(i => i.AuctionEnd < DateTime.UtcNow),
                "endingSoon" => query.Match(i => i.AuctionEnd > DateTime.UtcNow && i.AuctionEnd < DateTime.UtcNow.AddHours(6)),
                _ => query.Match(i => i.AuctionEnd > DateTime.UtcNow)
            };

            if(!string.IsNullOrEmpty(searchParams.Seller))
            {
                query = query.Match(i => i.Seller == searchParams.Seller);
            }

            if(!string.IsNullOrEmpty(searchParams.Winner))
            {
                query = query.Match(i => i.Winner == searchParams.Winner);
            }
            
            query.PageNumber(searchParams.PageNumber).PageSize(searchParams.PageSize);

            var result = await query.ExecuteAsync();

            return Ok(new
            {
                result = result.Results,
                pageCount = result.PageCount,
                totalCount = result.TotalCount
            });
        }
    }

}