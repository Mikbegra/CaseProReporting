using Modelcasepro.Entities;
using Modelcasepro.RequestModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domaincasepro.Repository
{
	public interface ILoginRepository
	{
        public UsersTable Authentication(UsersTable user);
        public bool UpdateLastLogin(int id);
    }
}
