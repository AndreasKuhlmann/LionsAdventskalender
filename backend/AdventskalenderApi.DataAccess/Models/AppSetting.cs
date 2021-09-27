using System;
using BeerBest.Infrastructure.Abstract;
using BeerBest.Infrastructure.Interfaces;

namespace AdventskalenderApi.DataAccess.Models
{
    public class AppSetting : IEntityBase<Guid>, IAppSetting
    {
        public System.Guid Id { get; set; }
        public string AppName { get; set; }
        public string AzureNotificationHubConnectionString { get; set; }
        public string AzureNotificationHubName { get; set; }
        public string Country { get; set; }
        public string CultureCode { get; set; }
        public string SmtpHost { get; set; }
        public string SmtpPort { get; set; }
        public string SmtpUsername { get; set; }
        public string SmtpPassword { get; set; }
        public string SmtpSenderEmailAddress { get; set; }
        public string EmailConfirmationTemplate { get; set; }

        // Store version identifiers...
        public string AppStoreUrl { get; set; }
        public string AppStoreVersion { get; set; }
        public string PlayStoreUrl { get; set; }
        public string PlayStoreVersion { get; set; }

        public string LogoUrl { get; set; }
        public string BackgroundLogoUrl { get; set; }
        public string PrimaryColor { get; set; }
        public string PrimaryContrastColor { get; set; }
        public string SecondaryColor { get; set; }
        public string SecondaryContrastColor { get; set; }
        public string TertiaryColor { get; set; }
        public string TertiaryContrastColor { get; set; }

        public string AccentColor { get; set; }
        public string SuccessColor { get; set; }
        public string WarningColor { get; set; }
        public string DangerColor { get; set; }
        public string MediumColor { get; set; }
        public string LightColor { get; set; }

        public string BackgroundColor { get; set; }
        public string LogoBackgroundSize { get; set; }
        public string WelcomeLogoBackgroundSize { get; set; }
    }
}
