using Microsoft.Extensions.Hosting;
using System.Threading.Tasks;
using AdventskalenderApi.DataAccess;
using AdventskalenderApi.DataAccess.Models.Identity;
using AdventskalenderApi.Infrastructure.Provider;
using AdventskalenderApi.Repository.Interfaces;
using AdventskalenderApi.Services;
using AdventskalenderApi.Services.Interfaces;
using BeerBest.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;

namespace AdventskalenderApi
{
    public class Program
    {
        public static async Task Main()
        {
            var host = new HostBuilder()
                .ConfigureFunctionsWorkerDefaults(
                    //workerApplication =>
                    //{
                    //    // Register our custom middleware with the worker
                    //    workerApplication.UseMiddleware<MyCustomMiddleware>();
                    //}
                    )
                .ConfigureLogging(logging =>
                {
                    logging.ClearProviders();
                    logging.AddConsole();
                })
                .ConfigureServices(s =>
                {
                    var config = new ConfigurationBuilder()
                        .AddJsonFile("local.settings.json", optional: true, reloadOnChange: true)
                        .AddEnvironmentVariables()
                        .Build();
                    // Database services...
                    s.AddSingleton<ITenantIdProvider<string>>(new TenantIdProvider(() => config["TenantId"]));
                    s.AddDbContext<AdventskalenderApiContext>();

                    // Identity services...
                    s.AddIdentityCore<ApplicationUser>();
                    s.AddScoped<IUserStore<ApplicationUser>, ApplicationUserStore>();
                    s.AddScoped<IRoleStore<ApplicationRole>, ApplicationRoleStore>();


                    // Application services...
                    s.AddScoped<IAppSettingRepository, AppSettingRepository>();
                    s.AddScoped<IAppSettingService, AppSettingService>();
                    s.AddScoped<IGewinnRepository, GewinnRepository>();
                    s.AddScoped<IGewinnService, GewinnService>();
                })
                .Build();

            await host.RunAsync();
        }
    }
}