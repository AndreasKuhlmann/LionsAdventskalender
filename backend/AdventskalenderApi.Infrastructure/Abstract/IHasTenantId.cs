using System;

namespace BeerBest.Infrastructure.Abstract
{
    public interface IHasTenantId
    {
        public string TenantId { get; protected internal set; }
    }
}