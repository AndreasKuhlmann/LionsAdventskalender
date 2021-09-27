namespace BeerBest.Infrastructure.Interfaces
{
    public interface IAppSetting
    {
        System.Guid Id { get; set; }
        string AppName { get; set; }
        string AzureNotificationHubConnectionString { get; set; }
        string AzureNotificationHubName { get; set; }
        string Country { get; set; }
        string CultureCode { get; set; }
        string SmtpHost { get; set; }
        string SmtpPort { get; set; }
        string SmtpUsername { get; set; }
        string SmtpPassword { get; set; }
        string SmtpSenderEmailAddress { get; set; }
        string EmailConfirmationTemplate { get; set; }

        // Store version identifiers...
        public string AppStoreUrl { get; set; }
        public string AppStoreVersion { get; set; }
        public string PlayStoreUrl { get; set; }
        public string PlayStoreVersion { get; set; }

        string LogoUrl { get; set; }
        string BackgroundLogoUrl { get; set; }
        string PrimaryColor { get; set; }
        string PrimaryContrastColor { get; set; }
        string SecondaryColor { get; set; }
        string SecondaryContrastColor { get; set; }
        string TertiaryColor { get; set; }
        string TertiaryContrastColor { get; set; }

        string AccentColor { get; set; }
        string SuccessColor { get; set; }
        string WarningColor { get; set; }
        string DangerColor { get; set; }
        string MediumColor { get; set; }
        string LightColor { get; set; }

        string BackgroundColor { get; set; }
        string LogoBackgroundSize { get; set; }
        string WelcomeLogoBackgroundSize { get; set; }
    }
}