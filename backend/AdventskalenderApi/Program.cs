using Microsoft.Azure.Functions.Worker.Configuration;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
namespace AdventskalenderApi
{
    public class Program
    {
        public static void Main()
        {
            var host = new HostBuilder()
                .ConfigureFunctionsWorkerDefaults(
                    //workerApplication =>
                    //{
                    //    // Register our custom middleware with the worker
                    //    workerApplication.UseMiddleware<MyCustomMiddleware>();
                    //}
                    )
                //.ConfigureServices(s =>
                //{
                //    s.AddSingleton<IHttpResponderService, DefaultHttpResponderService>();
                //})
                .Build();

            host.Run();
        }
    }
}