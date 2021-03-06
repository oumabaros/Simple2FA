using GoogleAuthenticatorService.Core;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Simple2FA.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Simple2FA.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
       
        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }
        
        [HttpPost]
        public JsonResult Login(string LoginData)
        {
            User usr = new User();
            usr = JsonConvert.DeserializeObject<User>(LoginData);
            
            //get user login details from database
            DataTable dat = DBF.GetCMS();
            string usr_name = dat.Rows[0]["UserName"].ToString();
            string pwd= dat.Rows[0]["Password"].ToString();

            //attempt login
            if(usr_name==usr.UserName && pwd == usr.Password)
            {
                //login successful?...go to 2FA action 
               return Json(new { username=usr.UserName,status="1",statustext="Login Successful!" });
            }
            //login failed?...return login form
             return Json(new { username = usr.UserName, status = "0",statustext="Login Failed!" });
        }
        [HttpGet]
        public ActionResult TwoFactorAuth( string username)
        {
            TwoFactorAuthenticator twoFactor = new TwoFactorAuthenticator();
            var secretCode = Guid.NewGuid().ToString().Replace("-", "")[0..10];
            var accountSecretKey = $"{secretCode}-{username}";
            var setupInfo = twoFactor.GenerateSetupCode("Simple2FA", accountSecretKey, 400, 400);
            ViewBag.SetupCode = setupInfo.ManualEntryKey;
            ViewBag.BarcodeImageUrl = setupInfo.QrCodeSetupImageUrl;
            ViewBag.accountSecretKey = accountSecretKey;
            return View();
        }

        [HttpPost]
        public ActionResult TwoFactorAuthPost(string accountSecretKey, string inputCode)
        {
            TwoFactorAuthenticator twoFactor = new TwoFactorAuthenticator();
            bool isValid = twoFactor.ValidateTwoFactorPIN(accountSecretKey, inputCode);
            if (!isValid)
            {
                return Redirect("/Home/Index");
            }
            return Redirect("/Home/Dashboard");
        }
        private static string TwoFactorKey(string accountSecretKey)
        {
            return $"mysecretkey+{accountSecretKey}";
        }

        public IActionResult Privacy()
        {
            return View();
        }

        public IActionResult Dashboard()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
