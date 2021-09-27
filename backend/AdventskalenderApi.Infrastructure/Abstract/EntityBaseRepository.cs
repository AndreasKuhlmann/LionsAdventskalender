using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace BeerBest.Infrastructure.Abstract
{
    public abstract class
        EntityBaseRepository<TEntity, TKey, TDbContext> : IEntityBaseRepository<TEntity, TKey, TDbContext>
                where TEntity : class, IEntityBase<TKey>, new()
                where TKey : IEquatable<TKey>
                where TDbContext : DbContext, IDisposable
    {
        protected EntityBaseRepository(TDbContext context)
        {
            this.DbContext = context;
        }

        public TDbContext DbContext { get; set; }


        public virtual bool Any(Expression<Func<TEntity, bool>> predicate)
        {
            return this.DbContext.Set<TEntity>().AsNoTracking().Any(predicate);
        }

        public virtual IQueryable<TEntity> GetAll(params Expression<Func<TEntity, object>>[] includeProperties)
        {
            IQueryable<TEntity> query = this.DbContext.Set<TEntity>();
            foreach (var includeProperty in includeProperties)
            {
                query = query.Include(includeProperty);
            }
            return query;
        }
        public virtual IQueryable<TEntity> ReadAll(params Expression<Func<TEntity, object>>[] includeProperties)
        {
            {
                IQueryable<TEntity> query = this.DbContext.Set<TEntity>().AsNoTracking();
                foreach (var includeProperty in includeProperties)
                {
                    query = query.Include(includeProperty).AsNoTracking();
                }
                return query;
            }
        }
        public IQueryable<TEntity> Get(Expression<Func<TEntity, bool>> predicate, params Expression<Func<TEntity, object>>[] includeProperties)
        {
            IQueryable<TEntity> query = this.DbContext.Set<TEntity>();
            foreach (var includeProperty in includeProperties)
            {
                query = query.Include(includeProperty);
            }
            return query.Where(predicate);
        }
        public IQueryable<TEntity> Read(Expression<Func<TEntity, bool>> predicate, params Expression<Func<TEntity, object>>[] includeProperties)
        {
            IQueryable<TEntity> query = this.DbContext.Set<TEntity>().AsNoTracking();
            foreach (var includeProperty in includeProperties)
            {
                query = query.Include(includeProperty).AsNoTracking();
            }
            return query.Where(predicate).AsNoTracking();
        }
        public virtual int Count()
        {
            return this.DbContext.Set<TEntity>().Count();
        }
        public virtual TEntity GetSingle(TKey id, params Expression<Func<TEntity, object>>[] includeProperties)
        {
            IQueryable<TEntity> query = this.DbContext.Set<TEntity>();
            foreach (var includeProperty in includeProperties)
            {
                query = query.Include(includeProperty);
            }
            return query.FirstOrDefault(d => d.Id.Equals(id));
        }
        public virtual TEntity ReadSingle(TKey id, params Expression<Func<TEntity, object>>[] includeProperties)
        {
            IQueryable<TEntity> query = this.DbContext.Set<TEntity>().AsNoTracking();
            foreach (var includeProperty in includeProperties)
            {
                query = query.Include(includeProperty).AsNoTracking();
            }
            return query.FirstOrDefault(d => d.Id.Equals(id));
        }
        public virtual TEntity GetSingle(Expression<Func<TEntity, bool>> predicate, params Expression<Func<TEntity, object>>[] includeProperties)
        {
            IQueryable<TEntity> query = this.DbContext.Set<TEntity>();
            foreach (var includeProperty in includeProperties)
            {
                query = query.Include(includeProperty);
            }
            return query.Where(predicate).FirstOrDefault();
        }
        public virtual TEntity ReadSingle(Expression<Func<TEntity, bool>> predicate, params Expression<Func<TEntity, object>>[] includeProperties)
        {
            IQueryable<TEntity> query = this.DbContext.Set<TEntity>().AsNoTracking();
            foreach (var includeProperty in includeProperties)
            {
                query = query.Include(includeProperty).AsNoTracking();
            }
            return query.Where(predicate).AsNoTracking().FirstOrDefault();
        }
        public virtual void Add(TEntity entity)
        {
            this.DbContext.Set<TEntity>().Add(entity);
        }
        public virtual void AddRange(IEnumerable<TEntity> entities)
        {
            this.DbContext.Set<TEntity>().AddRange(entities);
        }

        public virtual void Update(TEntity entity)
        {
            EntityEntry<TEntity> dbEntityEntry = this.DbContext.Entry(entity);
            dbEntityEntry.State = EntityState.Modified;
        }
        public virtual void Delete(TEntity entity)
        {
            this.DbContext.Set<TEntity>().Remove(entity);
        }
        public virtual void DeleteRange(IEnumerable<TEntity> entities)
        {
            this.DbContext.Set<TEntity>().RemoveRange(entities);
        }
        public virtual void DeleteWhere(Expression<Func<TEntity, bool>> predicate)
        {
            IEnumerable<TEntity> entities = this.DbContext.Set<TEntity>().Where(predicate);
            this.DbContext.Set<TEntity>().RemoveRange(entities);
        }
        public virtual void Commit()
        {
            this.DbContext.SaveChanges();
        }
        public virtual int SaveChanges()
        {
            return this.DbContext.SaveChanges();
        }
        public virtual Task<int> SaveChangesAsync()
        {
            return this.DbContext.SaveChangesAsync();
        }
        public virtual Task<int> SaveChangesAsync(CancellationToken token)
        {
            return this.DbContext.SaveChangesAsync(token);
        }
    }
}
