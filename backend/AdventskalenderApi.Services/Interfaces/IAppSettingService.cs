using System;
using System.Collections.Generic;
using AdventskalenderApi.DataAccess.Models;

namespace AdventskalenderApi.Services.Interfaces
{
    public interface IAppSettingService
    {
        AppSetting GetById(Guid settingsId);
        AppSetting GetByAppName(string appName);
        void CreateNewAppWithOrganisation(string appName, string organisationName, string country, string cultureCode, string smtpUsername, DateTime eventCycleStart, int eventCycleInMonth, string memberName, string membersName, string officerNames, string userFirstname, string userLastname, string userEmail, string userPassword);
        IEnumerable<AppSetting> GetByAppName(string appname, string cultureCode);
    }
}
