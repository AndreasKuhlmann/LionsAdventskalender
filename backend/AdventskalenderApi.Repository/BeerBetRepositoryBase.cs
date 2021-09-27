using System;
using BeerBest.Infrastructure.Abstract;
using AdventskalenderApi.DataAccess;

namespace AdventskalenderApi.Repository
{
    public class AdventskalenderApiRepositoryBase<TEntity, TKey> : EntityBaseRepository<TEntity, TKey, AdventskalenderApiContext>
        where TEntity : class, IEntityBase<TKey>, new()
        where TKey : IEquatable<TKey>
    {
        public AdventskalenderApiRepositoryBase(AdventskalenderApiContext context) : base(context)
        {
        }

    }
}
