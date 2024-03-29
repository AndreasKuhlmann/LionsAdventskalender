﻿using System.ComponentModel.DataAnnotations;

namespace AdventskalenderApi.DataAccess.Models.Identity.AccountViewModels
{
    public class LoginWithRecoveryCodeViewModel
    {
            [Required]
            [DataType(DataType.Text)]
            [Display(Name = "Recovery Code")]
            public string RecoveryCode { get; set; }
    }
}
