using System.ComponentModel.DataAnnotations;

namespace AdventskalenderApi.DataAccess.Models.Identity.AccountViewModels
{
    public class ExternalLoginViewModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
