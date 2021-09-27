using System;
using BeerBest.Infrastructure.Interfaces;

namespace AdventskalenderApi.DataAccess.Models.Identity
{
    public class ApplicationUserStore : UserStoreMultiTenant<ApplicationUser, ApplicationRole, Guid, string>
    {
        public ApplicationUserStore(AdventskalenderApiContext context, ITenantIdProvider<string> tenantProvider) : base(context, tenantProvider)
        {
            this.TenantId = tenantProvider.TenantId;
        }
    }
}