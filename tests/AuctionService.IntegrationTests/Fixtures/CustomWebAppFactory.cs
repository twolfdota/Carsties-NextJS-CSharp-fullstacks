using AuctionService.Data;
using MassTransit;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.VisualBasic;
using Testcontainers.PostgreSql;
using WebMotions.Fake.Authentication.JwtBearer;

namespace AuctionService.IntegrationTests;

public class CustomWebAppFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private PostgreSqlContainer _container = new PostgreSqlBuilder().Build();
    public async Task InitializeAsync()
    {
        await _container.StartAsync();
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureTestServices(services =>
        {
            services.RemoveDBContext<AuctionDbContext>();

            services.AddDbContext<AuctionDbContext>(options =>
            {
                options.UseNpgsql(_container.GetConnectionString());
            });

            services.AddMassTransitTestHarness();

            services.EnsureCreated<AuctionDbContext>();

            services.AddAuthentication(FakeJwtBearerDefaults.AuthenticationScheme)
            .AddFakeJwtBearer(opt =>
            {
                opt.BearerValueType = FakeJwtBearerBearerValueType.Jwt;
            });
        });
    }
    Task IAsyncLifetime.DisposeAsync() => _container.DisposeAsync().AsTask();
}


