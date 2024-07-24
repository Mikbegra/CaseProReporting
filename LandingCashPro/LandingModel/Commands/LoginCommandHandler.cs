using Domaincasepro.Repository;
using Modelcasepro.Entities;
using Modelcasepro.Factory;
using Modelcasepro.RequestModel;
using Modelcasepro.ResponseModel;

namespace Domaincasepro.Commands
{
    public class LoginCommandHandler
    {
        private readonly ILoginRepository _loginRepo;

        public LoginCommandHandler(ILoginRepository loginRepo)
        {
            _loginRepo = loginRepo;
        }

        public LoginResponseModel Execute(LoginRequestModel user, UsersTable res)
        {
            try
            {
                if (res != null && res.Password == user.Password)
                {
                    if (_loginRepo.UpdateLastLogin(res.Id))
                        return LoginResponseFactory.Create(true, res.fk_RoleId == 1 ? "ReadOnly" : "Admin", res.Id, "Login successful");
                    else
                        return LoginResponseFactory.Create(false, "Something went wrong, Please try again!");
                }
                else // Authentication failed
                    return LoginResponseFactory.Create(false, "Invalid username or password");
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while Execute Authorize User: " + ex.Message);
            }
        }
    }
}