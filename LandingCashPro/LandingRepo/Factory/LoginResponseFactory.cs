using Modelcasepro.ResponseModel;

namespace Modelcasepro.Factory
{
    public class LoginResponseFactory
    {
        public static LoginResponseModel Create(bool success, string message)
        {
            return new LoginResponseModel
            {
                Success = success,
                Message = message
            };
        }

        public static LoginResponseModel Create(bool success, string role, int userId, string message)
        {
            return new LoginResponseModel
            {
                Success = success,
                Message = message,
                Role = role,
                UserId = userId
            };
        }
    }
}