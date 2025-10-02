using MassTransit;
using NotificationService;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddMassTransit(x =>
{
    x.AddConsumersFromNamespaceContaining<AuctionCreatedConsumer>();
    x.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter("nt", false));

    x.UsingRabbitMq((context, cfg) =>
    {


        cfg.ConfigureEndpoints(context);
    });
});

builder.Services.AddSignalR(options =>
{
    options.EnableDetailedErrors = true;   // More detailed exception info
});

var app = builder.Build();

app.MapHub<NotificationHub>("/notifications");

app.Run();
