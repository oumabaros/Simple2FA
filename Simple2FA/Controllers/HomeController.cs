using Google.Authenticator;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Simple2FA.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Linq;
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
        [HttpGet]
        public ActionResult Login()
        {
            return View();
        }
        [HttpPost]
        public ActionResult Login(User user)
        {
            //get user login details from database
            DataTable dat = DBF.GetCMS();
            string username = dat.Rows[0]["UserName"].ToString();
            string password= dat.Rows[0]["Password"].ToString();

            //attempt login
            if(user.UserName==username && user.Password == password)
            {
                //login successful?...go to 2FA action 
               return RedirectToAction("TwoFactorAuth",new { username=username});
            }
            //login failed?...return login form
            ViewBag.LoginMessage = "Login Failed";
            return View();
        }
        [HttpGet]
        public ActionResult TwoFactorAuth( string username)
        {
            TwoFactorAuthenticator twoFactor = new TwoFactorAuthenticator();
            var setupInfo = twoFactor.GenerateSetupCode("Simple2FA", username, TwoFactorKey(username), false, 3);
            
            ViewBag.SetupCode = setupInfo.ManualEntryKey;
            ViewBag.BarcodeImageUrl = setupInfo.QrCodeSetupImageUrl;
            ViewBag.username = username;
            return View();
        }

        [HttpPost]
        public ActionResult TwoFactorAuthPost(string inputCode,string username)
        {
            TwoFactorAuthenticator twoFactor = new TwoFactorAuthenticator();
            bool isValid = twoFactor.ValidateTwoFactorPIN(TwoFactorKey(username), inputCode);
            if (!isValid)
            {
                return Redirect("/Home/Login");
            }
            return Redirect("/Home/Index");
        }
        private static string TwoFactorKey(string username)
        {
            return $"mysecretkey+{username}";
        }

        public IActionResult Privacy()
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
