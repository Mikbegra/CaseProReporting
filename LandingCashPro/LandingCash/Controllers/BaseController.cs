using Microsoft.AspNetCore.Mvc;

namespace LandingCash.Controllers
{
    public class BaseController : Controller
    {
        public static string RoleName { get; set; } = "";
        public static int UserId { get; set; } = 0;
        public static int CurrentActivityId { get; set; } = 0;
    }
}