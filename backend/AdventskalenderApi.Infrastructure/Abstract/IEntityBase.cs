using System;

namespace BeerBest.Infrastructure.Abstract
{
    public interface IEntityBase<T>  where T : IEquatable<T>
    {
        T Id { get; set; }
    }
}
