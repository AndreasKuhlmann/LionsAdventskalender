using System;

namespace AdventskalenderApi.DataAccess.Models.Identity
{
    // Add profile data for application users by adding properties to the ApplicationUser class
    public class ApplicationUser : IdentiyUserMultiTenant<Guid, string>
    {
        public Guid? MemberId { get; set; }
        public Guid? OrganisationId { get; set; }
        public string OrganisationName { get; set; }
    }
}
