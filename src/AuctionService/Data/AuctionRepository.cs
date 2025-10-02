using System;
using AuctionService.DTOs;
using AuctionService.Entities;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace AuctionService.Data;

public class AuctionRepository : IAuctionRepository
{
    private readonly AuctionDbContext _context;
    private readonly IMapper _mapper;

    public AuctionRepository(AuctionDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }
    public void AddAuction(Auction auction)
    {
        _context.Auctions.Add(auction);
    }

    public async Task<AuctionDto> GetAuctionByIdAsync(Guid Id)
    {
        return await _context.Auctions
            .ProjectTo<AuctionDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(a => a.Id == Id);
    }

    public async Task<List<AuctionDto>> GetAuctionDtosAsync(string date)
    {
        {
            var query = _context.Auctions.AsQueryable();

            if (!string.IsNullOrEmpty(date) && DateTime.TryParse(date, out var parsedDate))
            {
                query = query.Where(a => a.CreatedAt.CompareTo(DateTime.Parse(date).ToUniversalTime()) > 0);
            }

            return await query.ProjectTo<AuctionDto>(_mapper.ConfigurationProvider).ToListAsync();
        }
    }

    public async Task<Auction> GetAuctionEntityById(Guid Id)
    {
        return await _context.Auctions
            .Include(a => a.Item)
            .FirstOrDefaultAsync(a => a.Id == Id);
    }

    public void RemoveAuction(Auction auction)
    {
        _context.Auctions.Remove(auction);
    }

    public async Task<bool> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }
}
