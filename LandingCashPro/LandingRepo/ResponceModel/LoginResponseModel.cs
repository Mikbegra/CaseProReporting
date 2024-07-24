namespace Modelcasepro.ResponseModel
{
    public class LoginResponseModel
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public string Role { get; set; }
        public string Email { get; set; }
        public int UserId { get; set; }
        public DateTime LastLogindate { get; set; }
    }
}