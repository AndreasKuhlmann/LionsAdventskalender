using System;
using BeerBest.Infrastructure.Abstract;
using AdventskalenderApi.DataAccess;
using AdventskalenderApi.DataAccess.Models;
using AdventskalenderApi.Repository;

namespace ComApp.Core.Repository.Interfaces
{
    public interface IGewinnRepository : IEntityBaseRepository<Gewinn, Guid, AdventskalenderApiContext> { }
    public class GewinnRepository :
        AdventskalenderApiRepositoryBase<Gewinn, Guid>,
        IGewinnRepository
    {
        public GewinnRepository(AdventskalenderApiContext context) : base(context)
        {
        }
    }
}
