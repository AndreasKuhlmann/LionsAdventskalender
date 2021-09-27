using System;
using System.Collections.Generic;

namespace BeerBest.Infrastructure.Abstract
{
    public class EntityBaseComparer<T> : IEqualityComparer<IEntityBase<T>> where T : IEquatable<T>
    {
        public bool Equals(IEntityBase<T> x, IEntityBase<T> y)
        {
            bool isEqual = false;
            if (ReferenceEquals(x, y))
            {
                isEqual = true;
            }
            else if (!x.Id.Equals(other: default) && !y.Id.Equals(default))
            {
                isEqual = x.Id.Equals(y.Id);
            }

            return isEqual;
        }

        public int GetHashCode(IEntityBase<T> obj)
        {
            // Linq usually calls GetHashCode() for comparisations in the first place. It only calls Equals() if GetHashCode() 
            // returns the same value for both objects been compared! 
            // Otherwise Linq considers both objects as different and will not call Equals() at all, because of performance reasons.
            // So returning a constant value from GetHashCode() of this type forces Linq to call Equals() for each comparisation...
            return 1;
        }
        private static EntityBaseComparer<T> _default;
        public static EntityBaseComparer<T> Default => _default ??= new EntityBaseComparer<T>();
    }
}
