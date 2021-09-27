using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AdventskalenderApi.DataAccess.Models;

namespace AdventskalenderApi.Services.Interfaces
{
    public interface IGewinnService
    {
        Gewinn GetById(Guid settingsId);
    }
}
