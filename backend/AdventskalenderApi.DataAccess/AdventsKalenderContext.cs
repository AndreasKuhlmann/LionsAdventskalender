using System;
using BeerBest.Infrastructure.Abstract;
using BeerBest.Infrastructure.Interfaces;
using AdventskalenderApi.DataAccess.Models;
using AdventskalenderApi.DataAccess.Models.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace AdventskalenderApi.DataAccess
{
    public class AdventskalenderApiContext : IdentityDbContext<ApplicationUser, ApplicationRole, Guid>
    {
        private readonly IConfiguration _configuration;
        internal string TenantId { get; set; }
        public AdventskalenderApiContext(DbContextOptions<AdventskalenderApiContext> options, 
            ITenantIdProvider<string> tenantIdProvider, 
            IConfiguration configuration)
            : base(options)
        {
            this.TenantId = tenantIdProvider.TenantId;
            if (string.IsNullOrWhiteSpace(tenantIdProvider.TenantId))
                this.TenantId = "adventskalenderapi";

            this._configuration = configuration;
        }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.SetQueryFilterOnAllEntities<IHasTenantId>(p => p.TenantId == TenantId);
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                var connectionString = this._configuration.GetConnectionString("ConnectionStrings:ApplicationDBContext");
                optionsBuilder.UseSqlServer(connectionString, opt =>
                {
                    opt.MigrationsAssembly("AdventskalenderApi.DataAccess");
                    //opt.CommandTimeout(150000);
                    opt.EnableRetryOnFailure();
                });
            }
        }
        public DbSet<Gewinn> Gewinne { get; set; }
        public DbSet<AppSetting> AppSettings { get; set; }
    }
}
