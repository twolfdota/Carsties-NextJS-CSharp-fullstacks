using AuctionService.Data;
using AuctionService.Data.Migrations;
using Grpc.Core;

namespace AuctionService;

public class GrpcAuctionService : GrpcAuction.GrpcAuctionBase
{
    private readonly AuctionDbContext _context;

    public GrpcAuctionService(AuctionDbContext context)
    {
        _context = context;
    }

    public override async Task<GrpcAuctionResponse> GetAuction(GetAuctionRequest request, ServerCallContext context)
    {
        Console.WriteLine("==> Receive Grpc request for auction");

        var auction = await _context.Auctions.FindAsync(Guid.Parse(request.Id)) ?? throw new RpcException(new Status(StatusCode.NotFound, "NotFound"));
        
        var response = new GrpcAuctionResponse
        {
            Auction = new GrpcAuctionModel
            {
                AuctionEnd = auction.AuctionEnd.ToString(),
                Id = auction.Id.ToString(),
                ReservePirce = auction.ReservePrice,
                Seller = auction.Seller
            }
        };

        return response;
    }
}
