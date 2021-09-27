using System;
using System.Collections.Generic;
using System.Globalization;
using BeerBest.Infrastructure.Abstract;
using AdventskalenderApi.DataAccess.Models;
using AdventskalenderApi.Services.Interfaces;
using ComApp.Core.Repository.Interfaces;

namespace AdventskalenderApi.Services
{
    public class GewinnService : ServiceBase, IGewinnService
    {
        private readonly IGewinnRepository _settingRepository;

        public GewinnService(IGewinnRepository settingRepository)
        {
            this._settingRepository = settingRepository;
        }
        public Gewinn GetById(Guid settingsId)
        {
            return this._settingRepository.ReadSingle(s => s.Id == settingsId);
        }
    }
}
