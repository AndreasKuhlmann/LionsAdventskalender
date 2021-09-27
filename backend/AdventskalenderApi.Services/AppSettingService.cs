using System;
using System.Collections.Generic;
using System.Globalization;
using BeerBest.Infrastructure.Abstract;
using AdventskalenderApi.DataAccess.Models;
using AdventskalenderApi.Services.Interfaces;
using ComApp.Core.Repository.Interfaces;

namespace AdventskalenderApi.Services
{
    public class AppSettingService : ServiceBase, IAppSettingService
    {
        private readonly IAppSettingRepository _settingRepository;

        public AppSettingService(IAppSettingRepository settingRepository)
        {
            this._settingRepository = settingRepository;
        }
        public AppSetting GetById(Guid settingsId)
        {
            return this._settingRepository.ReadSingle(s => s.Id == settingsId);
        }
        public AppSetting GetByAppName(string appname)
        {
            var setting = this._settingRepository.ReadSingle(s =>
                        // try to find the setting for the requested culture...
                        (s.AppName.ToLower() == appname && (s.CultureCode.ToLower() == CultureInfo.CurrentCulture.Name.ToLower() || s.CultureCode.ToLower().StartsWith(CultureInfo.CurrentCulture.TwoLetterISOLanguageName.ToLower()))) ||
                        // other wise try to find the setting for en culture...
                        (s.AppName.ToLower() == appname && s.CultureCode.ToLower().StartsWith("en")) ||
                        // other wise just return the first available setting...
                        (s.AppName.ToLower() == appname));

            return setting;
        }
        public IEnumerable<AppSetting> GetByAppName(string appname, string cultureCode)
        {
            var setting = this._settingRepository.Read(s =>
                s.AppName.ToLower() == appname && s.CultureCode.ToLower() == cultureCode.ToLower());
            return setting;
        }
        public void CreateNewAppWithOrganisation(string appName, string organisationName, string country, string cultureCode, string smtpUsername, DateTime eventCycleStart, int eventCycleInMonth, string memberName, string membersName, string officerNames, string userFirstname, string userLastname, string userEmail, string userPassword)
        {
            var setting = this._settingRepository.GetSingle(s => s.AppName.ToLower() == appName.ToLower());
            if (setting == null)
            {
                setting = new AppSetting
                {
                    Id = Guid.NewGuid(),
                    AppName = appName,
                    Country = "Germany",
                    CultureCode = "de",
                    AzureNotificationHubConnectionString = "Endpoint=sb://comapps.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=qDjGDVbHT4Mj6YOiqG/ZqrgdQUi7xY1ilnZ8EFa/XUw=",
                    AzureNotificationHubName = appName.ToLower(),
                    SmtpHost = "smtp.office365.com",
                    SmtpPort = "25",
                    SmtpUsername = smtpUsername,
                    SmtpPassword = "Avareto!123",
                    SmtpSenderEmailAddress = "info@avareto.com",
                };
                this._settingRepository.Add(setting);
            }
        }

    }
}
