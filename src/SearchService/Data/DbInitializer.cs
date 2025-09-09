using System.Text.Json;
using Microsoft.OpenApi.Writers;
using MongoDB.Driver;
using MongoDB.Entities;
using SearchService.Models;

namespace SearchService.Data
{
    public class DbInitializer
    {
        public static async Task InitDb(WebApplication app)
        {
            // Initialization logic if needed
            await DB.InitAsync("SearchDb", MongoClientSettings.FromConnectionString(app.Configuration.GetConnectionString("MongoDb")));

            await DB.Index<Item>()
                .Key(i => i.Make, KeyType.Text)
                .Key(i => i.Model, KeyType.Text)
                .Key(i => i.Color, KeyType.Text)
                .CreateAsync();

            //Seed data if needed

            var count = await DB.CountAsync<Item>();

            using var scope = app.Services.CreateScope();

            var httpClient = scope.ServiceProvider.GetRequiredService<AuctionSvcHttpClient>();

            var items = await httpClient.GetItemsForSearchDb();

            Console.WriteLine($"Found {items.Count} items from the Auction Service");

            if (items.Count > 0)
            {
                await DB.SaveAsync(items);
                Console.WriteLine("Database seeded successfully.");
            }
            else
            {
                Console.WriteLine("Data already exists or no new items to add.");
            }
        }
    }
}