using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace BeerBest.Infrastructure.Abstract
{
    public interface 
        IEntityBaseRepository<TEntity, in TKey, TDbContext>  
        where TEntity : class, 
        IEntityBase<TKey>, new()
        where TKey : IEquatable<TKey>
        where TDbContext : DbContext, IDisposable
    {
        public TDbContext DbContext { get; set; }
        bool Any(Expression<Func<TEntity, bool>> predicate);
        IQueryable<TEntity> GetAll(params Expression<Func<TEntity, object>>[] includeProperties);
        IQueryable<TEntity> ReadAll(params Expression<Func<TEntity, object>>[] includeProperties);
        IQueryable<TEntity> Get(Expression<Func<TEntity, bool>> predicate, params Expression<Func<TEntity, object>>[] includeProperties);
        IQueryable<TEntity> Read(Expression<Func<TEntity, bool>> predicate, params Expression<Func<TEntity, object>>[] includeProperties);
        TEntity GetSingle(TKey id, params Expression<Func<TEntity, object>>[] includeProperties);
        TEntity ReadSingle(TKey id, params Expression<Func<TEntity, object>>[] includeProperties);
        TEntity GetSingle(Expression<Func<TEntity, bool>> predicate, params Expression<Func<TEntity, object>>[] includeProperties);
        TEntity ReadSingle(Expression<Func<TEntity, bool>> predicate, params Expression<Func<TEntity, object>>[] includeProperties);
        int Count();
        void Add(TEntity entity);
        void AddRange(IEnumerable<TEntity> entity);
        void Update(TEntity entity);
        void Delete(TEntity entity);
        void DeleteRange(IEnumerable<TEntity> entities);
        void DeleteWhere(Expression<Func<TEntity, bool>> predicate);
        void Commit();
        int SaveChanges();
        Task<int> SaveChangesAsync();
        Task<int> SaveChangesAsync(CancellationToken token);
    }
}
