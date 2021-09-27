using System;
using BeerBest.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace AdventskalenderApi.Provider
{
    public class TenantIdProvider : ITenantIdProvider<string>
    {
        public TenantIdProvider() { }
        public TenantIdProvider(Func<string> tenatId)
        {
            this.TenantId = tenatId();
        }
        public string TenantId { get; }
    }
}