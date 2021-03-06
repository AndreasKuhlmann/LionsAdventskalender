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
    public class RoleStoreMultiTenant<TRole, TKey, TTenantId> : RoleStore<TRole,AdventskalenderApiContext, TKey>, IHasTenantId<TTenantId>
        where TRole : IdentiyRoleMultiTenant<TKey, TTenantId>
        where TKey : IEquatable<TKey>
        where TTenantId : IEquatable<TTenantId>
    {
        public TTenantId TenantId { get; set; }
        public RoleStoreMultiTenant(AdventskalenderApiContext context, ITenantIdProvider<TTenantId> tenantProvider, IdentityErrorDescriber describer = null) : base(context, describer)
        {
            TenantId = tenantProvider.TenantId;
        }
        public override async Task<IdentityResult> CreateAsync(TRole role, CancellationToken cancellationToken = default)
        {
            cancellationToken.ThrowIfCancellationRequested();
            ThrowIfDisposed();
            if (role == null)
            {
                throw new ArgumentNullException(nameof(role));
            }
            role.TenantId = TenantId;
            Context.Add(role);
            if (AutoSaveChanges)
            {
                await Context.SaveChangesAsync(cancellationToken);
            }
            return IdentityResult.Success;
        }
        public override Task<TRole> FindByNameAsync(string normalizedName, CancellationToken cancellationToken = default)
        {
            cancellationToken.ThrowIfCancellationRequested();
            ThrowIfDisposed();
            return Roles.FirstOrDefaultAsync(r => r.NormalizedName == normalizedName && r.TenantId.Equals(TenantId), cancellationToken);
        }
    }
}