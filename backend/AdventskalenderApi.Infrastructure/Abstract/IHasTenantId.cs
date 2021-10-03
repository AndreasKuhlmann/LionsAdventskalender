using System;

namespace BeerBest.Infrastructure.Abstract
{
    public interface IHasTenantId<T>
    {
        public T TenantId { get; set; }
    }
}