using System.IO;
using AdventskalenderApi.Infrastructure.Provider;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;


namespace AdventskalenderApi.DataAccess
{
    public class AdventskalenderApiContextFactory : IDesignTimeDbContextFactory<AdventskalenderApiContext>
    {
        public AdventskalenderApiContext CreateDbContext(string[] args)
        {
            var config = new ConfigurationBuilder()
                .AddJsonFile("local.settings.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables()
                .Build();
            var optionsBuilder = new DbContextOptionsBuilder<AdventskalenderApiContext>();
            optionsBuilder.UseSqlServer(config.GetConnectionString("ApplicationDBContext"));
            return new AdventskalenderApiContext(optionsBuilder.Options, new TenantIdProvider(() => "adventskalender"), config);
        }
    }
}
