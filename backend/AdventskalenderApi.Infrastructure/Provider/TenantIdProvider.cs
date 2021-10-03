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
            string appName = null;
            if (contextAccessor.HttpContext != null && contextAccessor.HttpContext.Request.Headers.ContainsKey("AppName"))
                appName = contextAccessor.HttpContext.Request.Headers["AppName"];
            else if (contextAccessor.HttpContext != null && contextAccessor.HttpContext.Request.Query.ContainsKey("AppName"))
                appName = contextAccessor.HttpContext.Request.Query["AppName"][0];
            if (!string.IsNullOrWhiteSpace(appName))
                this.TenantId = appName;
        }
        public string TenantId { get; }
    }
}