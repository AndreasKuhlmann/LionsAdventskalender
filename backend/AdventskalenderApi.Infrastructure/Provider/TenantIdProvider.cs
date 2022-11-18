using System;
using BeerBest.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Http;

namespace AdventskalenderApi.Infrastructure.Provider
{
    public class TenantIdProvider : ITenantIdProvider<string>
    {
        public TenantIdProvider(Func<string> tenatId)
        {
            this.TenantId = tenatId();
        }
        public TenantIdProvider(IHttpContextAccessor contextAccessor)
        {
            string tenantId = null;
            if (contextAccessor.HttpContext != null && contextAccessor.HttpContext.Request.Headers.ContainsKey("TenantId"))
                tenantId = contextAccessor.HttpContext.Request.Headers["TenantId"];
            else if (contextAccessor.HttpContext != null && contextAccessor.HttpContext.Request.Query.ContainsKey("TenantId"))
                tenantId = contextAccessor.HttpContext.Request.Query["TenantId"][0];
            if (!string.IsNullOrWhiteSpace(tenantId))
                this.TenantId = tenantId;
        }
        public string TenantId { get; }
    }
}