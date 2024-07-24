using Domaincasepro.Repository;
using Modelcasepro.Entities;
using Modelcasepro.RequestModel;

namespace Domaincasepro.Queries
{
    public class LoginQueryHandler
    {
        private readonly ILoginRepository _repo;

        public LoginQueryHandler(ILoginRepository repo)
        {
            _repo = repo;
        }

        public UsersTable ExecuteLoginQuery(LoginRequestModel request)
        {
            UsersTable newuser = new UsersTable
            {
                ClientName = request.ClientName,
                Username = request.Username,
                Password = request.Password
            };

            // Execute the authentication query
            return _repo.Authentication(newuser);
        }
    }
}