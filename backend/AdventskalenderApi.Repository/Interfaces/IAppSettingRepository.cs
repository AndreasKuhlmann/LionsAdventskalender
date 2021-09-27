using System;
using BeerBest.Infrastructure.Abstract;
using AdventskalenderApi.DataAccess;
using AdventskalenderApi.DataAccess.Models;
using AdventskalenderApi.Repository;

namespace ComApp.Core.Repository.Interfaces
{
    public interface IAppSettingRepository : IEntityBaseRepository<AppSetting, Guid, AdventskalenderApiContext> { }
    public class AppSettingRepository :
        AdventskalenderApiRepositoryBase<AppSetting, Guid>,
        IAppSettingRepository
    {
        public AppSettingRepository(AdventskalenderApiContext context) : base(context)
        {
        }
    }
}
