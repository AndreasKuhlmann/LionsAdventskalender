using Microsoft.Azure.Functions.Worker.Configuration;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using System.Threading.Tasks;
using AdventskalenderApi.DataAccess;
using AdventskalenderApi.DataAccess.Models.Identity;
using AdventskalenderApi.Provider;
using AdventskalenderApi.Services;
using AdventskalenderApi.Services.Interfaces;
using BeerBest.Infrastructure.Interfaces;
using ComApp.Core.Repository.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

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
                    s.AddIdentityCore<ApplicationUser>();
                    s.AddScoped<IUserStore<ApplicationUser>, ApplicationUserStore>();
                    s.AddScoped<IRoleStore<ApplicationRole>, ApplicationRoleStore>();
                    s.AddDbContext<AdventskalenderApiContext>();
                    s.AddScoped<ITenantIdProvider<string>, TenantIdProvider>();
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