
using Newtonsoft.Json;
using QSYSTEM_WEBPORTAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Web;
using System.Web.Mvc;
using QRCoder;
using System.Drawing;
using System.IO;

namespace QSYSTEM_WEBPORTAL.Controllers
{
    public class HomeController : Controller
    {
        string url = System.Configuration.ConfigurationManager.AppSettings["apiURL"];
        string webURL = System.Configuration.ConfigurationManager.AppSettings["webURL"];
        string secondUrl;
        string token;
        string audience;
        string subject;
        Credentials credentialModel = new Credentials();

        protected override JsonResult Json(object data, string contentType, System.Text.Encoding contentEncoding, JsonRequestBehavior behavior)
        {
            return new JsonResult()
            {
                Data = data,
                ContentType = contentType,
                ContentEncoding = contentEncoding,
                JsonRequestBehavior = behavior,
                MaxJsonLength = Int32.MaxValue
            };
        }
        public ActionResult Index()
        {

            return View();
        }
        [ActionName("Authenticate")]
        public ActionResult Authenticate()
        {

            secondUrl = "auth";
            audience = "Institution";
            subject = "Institution Service";
            credentialModel = new Credentials()
            {
                username = "Rpl4hOZrTpWib77U",
                password = "Ssr4VokwCHNkh2nG"
            };


            return Json(new
            {
                data = ClientHttpToken(string.Format("login"))
            }, JsonRequestBehavior.AllowGet);
        }
        [ActionName("GetInstitutionList")]
        public ActionResult GetInstitutionList()
        {

            secondUrl = "institution";
            audience = "Institution";
            subject = "Institution Service";
            return Json(new
            {
                data = ClientHttp(string.Format("getall"), null)
            }, JsonRequestBehavior.AllowGet);
        }
        [ActionName("GetBranchList")]
        public ActionResult GetBranchList(string institutionID)
        {

            if (token == null)
            {
                Authenticate();
            }
            secondUrl = "branch";
            audience = "Institution";
            subject = "Institution Service";
            var insti = new Institution()
            {
                institutionID = institutionID
            };
            var dataInsti = JsonConvert.SerializeObject(insti);
            return Json(new
            {
                data = ClientHttp(string.Format("get"), dataInsti)
            }, JsonRequestBehavior.AllowGet);
        }
        [ActionName("GetAvailableTimeSlotPerBranch")]
        public ActionResult GetAvailableTimeSlotPerBranch(string branchCode, string date)
        {

            if (token == null)
            {
                Authenticate();
            }
            secondUrl = "branchschedule";
            audience = "Institution";
            subject = "Institution Service";
            var branch = new Branch()
            {

                branchCode = branchCode,
                date = date
            };
            var dataInsti = JsonConvert.SerializeObject(branch);
            return Json(new
            {
                data = ClientHttp(string.Format("getavailable"), dataInsti)
            }, JsonRequestBehavior.AllowGet);
        }
        [ActionName("GetRemainingSlotCount")]
        public ActionResult GetRemainingSlotCount(string scheduleCode)
        {

            if (token == null)
            {
                Authenticate();
            }
            secondUrl = "branchschedule";
            audience = "Institution";
            subject = "Institution Service";
            var sched = new Schedule()
            {

                scheduleCode = scheduleCode,
            };
            var dataInsti = JsonConvert.SerializeObject(sched);
            return Json(new
            {
                data = ClientHttp(string.Format("remainingcount"), dataInsti)
            }, JsonRequestBehavior.AllowGet);
        }
        public class BirthPlace
        {
            public string value { get; set; }
        }
        [ActionName("SearchCity")]
        public ActionResult SearchCity(string City)
        {

            if (token == null)
            {
                Authenticate();
            }
            secondUrl = "city";
            audience = "Institution";
            subject = "Institution Service";
            var bPlace = new BirthPlace()
            {
                value = City,
            };
            var dataInsti = JsonConvert.SerializeObject(bPlace);
            return Json(new
            {
                data = ClientHttp(string.Format("search"), dataInsti)
            }, JsonRequestBehavior.AllowGet);
        }
        [ActionName("ReserveSlot")]
        public ActionResult ReserveSlot(string scheduleCode, string fullName, string cityaddress, string birthdate, string mobileNumber, string email)
        {

            if (token == null)
            {
                Authenticate();
            }
            secondUrl = "branchschedulemember";
            audience = "Institution";
            subject = "Institution Service";
            var reserve = new Reservation()
            {

                scheduleCode = scheduleCode,
                fullName = fullName,
                birthplace = cityaddress,
                birthdate = birthdate,
                mobileNumber = mobileNumber,
                email = email,
                redirectURL = webURL

            };
            var dataInsti = JsonConvert.SerializeObject(reserve);
            return Json(new
            {
                data = ClientHttp(string.Format("reserve"), dataInsti)
            }, JsonRequestBehavior.AllowGet);
        }
        [ActionName("ConfirmReservation")]
        public ActionResult ConfirmReservation(string OTP, string reserveCode)
        {

            if (token == null)
            {
                Authenticate();
            }
            secondUrl = "branchschedulemember";
            audience = "Institution";
            subject = "Institution Service";
            var confirm = new Confirmation()
            {
                OTP = OTP,
                reserveCode = reserveCode,
            };
            var dataInsti = JsonConvert.SerializeObject(confirm);
            return Json(new
            {
                data = ClientHttp(string.Format("otpconfirm"), dataInsti)
            }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult RefCodeToQRCode(string qrText)
        {
            QRCodeGenerator qrGenerator = new QRCodeGenerator();
            QRCodeData qrCodeData = qrGenerator.CreateQrCode(qrText,
            QRCodeGenerator.ECCLevel.Q);
            QRCode qrCode = new QRCode(qrCodeData);
            Bitmap qrCodeImage = qrCode.GetGraphic(20);
            var bit = BitmapToBytes(qrCodeImage);
            return Json(new { data = Convert.ToBase64String(bit) }, JsonRequestBehavior.AllowGet);
        }
        private static Byte[] BitmapToBytes(Bitmap img)
        {
            using (MemoryStream stream = new MemoryStream())
            {
                img.Save(stream, System.Drawing.Imaging.ImageFormat.Png);
                return stream.ToArray();
            }
        }
        public string ClientHttp(string action, string param)
        {
            string finalReturn;


            using (var client = new HttpClient())
            {
                string jti = Guid.NewGuid().ToString();
                client.BaseAddress = new Uri(url + secondUrl + "/");
                List<string> postModelList = new List<string>();
                var postModel = new PostModel()
                {
                    jti = jti,
                    audience = audience,
                    subject = subject,
                    data = param
                };

                client.DefaultRequestHeaders.Add("Authorization", "Bearer " + token);
                var paramContent = JsonConvert.SerializeObject(postModel);
                var response = client.PostAsync(action, new StringContent(paramContent, UnicodeEncoding.UTF8, "application/json"));
                response.Wait();

                var result = response.Result;
                if (result.IsSuccessStatusCode)
                {
                    var read = result.Content.ReadAsStringAsync();
                    read.Wait();
                    finalReturn = read.Result;
                }
                else
                {
                    finalReturn = response.Result.StatusCode.ToString();
                }

                return finalReturn;
            }
        }
        public string ClientHttpToken(string action)
        {
            string finalReturn;


            using (var client = new HttpClient())
            {
                string jti = Guid.NewGuid().ToString();
                client.BaseAddress = new Uri(url + secondUrl + "/");
                List<string> postModelList = new List<string>();
                var dataCredentials = JsonConvert.SerializeObject(credentialModel);
                var postModel = new PostModel()
                {
                    jti = jti,
                    audience = audience,
                    subject = subject,
                    data = dataCredentials

                };
                var paramContent = JsonConvert.SerializeObject(postModel);
                var response = client.PostAsync(action, new StringContent(paramContent, UnicodeEncoding.UTF8, "application/json"));
                response.Wait();

                var result = response.Result;
                if (result.IsSuccessStatusCode)
                {
                    var read = result.Content.ReadAsStringAsync();
                    read.Wait();
                    finalReturn = read.Result;
                    dynamic data = JsonConvert.DeserializeObject(finalReturn);
                    if (data.data != null)
                    {
                        token = data.data;
                    }

                }
                else
                {
                    finalReturn = response.Result.StatusCode.ToString();
                }

                return finalReturn;
            }
        }

    }
}