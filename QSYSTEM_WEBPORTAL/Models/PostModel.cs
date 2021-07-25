using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using static QSYSTEM_WEBPORTAL.Controllers.HomeController;

namespace QSYSTEM_WEBPORTAL.Models
{
    public class PostModel
    {
        public string jti { get; set; }
        public string audience { get; set; }
        public string subject { get; set; }

        public string data { get; set; }
    }
   
}