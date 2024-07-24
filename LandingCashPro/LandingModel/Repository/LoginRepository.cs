using Modelcasepro.Entities;

namespace Domaincasepro.Repository
{
    public class LoginRepository : ILoginRepository
    {
        private LandingCaseproDbContext _context;
        public LoginRepository(LandingCaseproDbContext context)
        {
            this._context = context;
        }

        public UsersTable Authentication(UsersTable user)
        {
            var res = _context.UsersTables.Where(x => x.Username.Equals(user.Username) && x.Password.Equals(user.Password) && x.ClientName.Equals(user.ClientName)).FirstOrDefault();

            return res;
        }

        public bool UpdateLastLogin(int id)
        {
            bool success = false;
            var res = _context.UsersTables.Where(x => x.Id == id).FirstOrDefault();
            if (res != null)
            {
                res.LastLogindate = DateTime.Now;
                _context.SaveChanges();
                success = true;
            }
            return success;
        }
    }
}