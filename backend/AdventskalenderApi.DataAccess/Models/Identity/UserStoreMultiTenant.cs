using System;
using System.Threading;
using System.Threading.Tasks;
using BeerBest.Infrastructure.Abstract;
using BeerBest.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace AdventskalenderApi.DataAccess.Models.Identity
{
    public class UserStoreMultiTenant<TUser, TRole, TKey, TTenantId> : UserStore<TUser, TRole,AdventskalenderApiContext, TKey>, IHasTenantId<TTenantId>
        where TUser : IdentiyUserMultiTenant<TKey, TTenantId>
        where TRole : IdentiyRoleMultiTenant<TKey, TTenantId>
        where TKey : IEquatable<TKey>
        where TTenantId : IEquatable<TTenantId>
    {
        public TTenantId TenantId { get; set; }
        public UserStoreMultiTenant(AdventskalenderApiContext context, ITenantIdProvider<TTenantId> tenantProvider, IdentityErrorDescriber describer = null) : base(context, describer)
        {
            TenantId = tenantProvider.TenantId;
        }

        public override Task<IdentityResult> CreateAsync(TUser user, CancellationToken cancellationToken = new CancellationToken())
        {
            user.TenantId = TenantId;
            return base.CreateAsync(user, cancellationToken);
        }
        public override Task<TUser> FindByNameAsync(string normalizedUserName, CancellationToken cancellationToken = default)
        {
            cancellationToken.ThrowIfCancellationRequested();
            ThrowIfDisposed();
            return Users.FirstOrDefaultAsync(u => u.NormalizedUserName == normalizedUserName && u.TenantId.Equals(TenantId), cancellationToken);
        }
        public override Task<TUser> FindByEmailAsync(string normalizedEmail, CancellationToken cancellationToken = default)
        {
            cancellationToken.ThrowIfCancellationRequested();
            ThrowIfDisposed();
            return Users.FirstOrDefaultAsync(u => u.NormalizedEmail == normalizedEmail && u.TenantId.Equals(TenantId), cancellationToken);
        }
    }
}