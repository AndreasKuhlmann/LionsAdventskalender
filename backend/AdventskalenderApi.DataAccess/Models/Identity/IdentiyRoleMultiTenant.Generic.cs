using System;
using Microsoft.AspNetCore.Identity;

namespace AdventskalenderApi.DataAccess.Models.Identity
{
    public class IdentiyRoleMultiTenant<TKey, TTenantId> : IdentityRole<TKey>
        where TKey : IEquatable<TKey>
        where TTenantId : IEquatable<TTenantId>
    {
        public TTenantId TenantId { get; set; }
    }
}
