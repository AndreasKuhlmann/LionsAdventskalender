﻿using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;
using Microsoft.WindowsAzure.Storage;

namespace AdventskalenderApi.DataAccess.Models.Identity.ManageViewModels
{
    public class ExternalLoginsViewModel
    {
        public IList<UserLoginInfo> CurrentLogins { get; set; }

        public IList<AuthenticationScheme> OtherLogins { get; set; }

        public bool ShowRemoveButton { get; set; }

        public string StatusMessage { get; set; }
    }
}
