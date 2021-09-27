using System;
using Microsoft.AspNetCore.Identity;

namespace AdventskalenderApi.DataAccess.Models.Identity
{
    public class IdentiyUserMultiTenant<TKey, TTenantId> : IdentityUser<TKey>
        where TKey : IEquatable<TKey>
        where TTenantId : IEquatable<TTenantId>
    {
        public TTenantId TenantId { get; set; }
    }
}
