using System;
using BeerBest.Infrastructure.Interfaces;

namespace AdventskalenderApi.DataAccess.Models.Identity
{
    public class ApplicationRoleStore : RoleStoreMultiTenant<ApplicationRole, Guid, string>
    {
        public ApplicationRoleStore(AdventskalenderApiContext context, ITenantIdProvider<string> tenantProvider) : base(context, tenantProvider)
        {
            this.TenantKey = tenantProvider.TenantId;
        }
    }
}