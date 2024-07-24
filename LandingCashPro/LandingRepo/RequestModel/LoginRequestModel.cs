using System.ComponentModel.DataAnnotations;

namespace Modelcasepro.RequestModel
{
    public class LoginRequestModel
    {
        [Required(ErrorMessage = "Username is required")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Clientname is required")]
        public string ClientName { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }
    }
}