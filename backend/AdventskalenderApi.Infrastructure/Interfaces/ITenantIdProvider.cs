using System;

namespace BeerBest.Infrastructure.Interfaces
{
    public interface ITenantIdProvider<out T>
        where T : IEquatable<T>
    {
        T TenantId { get; }
    }
}