using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QSYSTEM_WEBPORTAL.Models
{
    public class Reservation
    {
        public string scheduleCode { get; set; }
        public string fullName { get; set; }
        public string birthplace { get; set; }
        public string birthdate { get; set; }
        public string mobileNumber { get; set; }
        public string email { get; set; }
        public string redirectURL { get; set; }
    }
}   