using System;
using System.Collections.Generic;
using System.Configuration;
using System.DirectoryServices;
using System.DirectoryServices.AccountManagement;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using ProjektuValdymas.Dal;
using ProjektuValdymas.Models.ActiveDirectory;
using ProjektuValdymas.Models.Asmenys;
using ProjektuValdymas.Models.Naudotojai;

namespace ProjektuValdymas.Bll
{
    public interface IActiveDirectoryBll
    {
        IList<ADUser> GetAllUsers(bool activeOnly = false);
        Naudotojas LogonActiveDirectoryUser(string userName, string password);
    }

    public class ActiveDirectoryBll : IActiveDirectoryBll
    {
        public ActiveDirectoryBll(IDalFactory dalFactory)
            : base()
        {
            this.bllFactory = new BllFactory();
        }

        private IBllFactory bllFactory;
        protected IBllFactory BllFactory
        {
            get { return this.bllFactory; }
        }

        #region Active Directory connection data

        private string ADDomain
        {
            get { return ConfigurationManager.AppSettings["ActiveDirectoryDomain"]; }
        }

        private string ADUserName
        {
            get { return ConfigurationManager.AppSettings["ActiveDirectoryUserName"]; }
        }

        private string ADPassword
        {
            get { return ConfigurationManager.AppSettings["ActiveDirectoryPassword"]; }
        }

        #endregion

        /// <summary>
        /// Gets all Active Directory users
        /// </summary>
        /// <returns></returns>
        public IList<ADUser> GetAllUsers(bool activeOnly = false)
        {
            var users = new List<ADUser>();

            try
            {
                using (var context = new PrincipalContext(ContextType.Domain, ADDomain, ADUserName, ADPassword))
                {
                    using (var searcher = new PrincipalSearcher(new UserPrincipal(context)))
                    {
                        foreach (var result in searcher.FindAll())
                        {
                            DirectoryEntry de = result.GetUnderlyingObject() as DirectoryEntry;

                            if (de.Properties["samAccountName"].Value == null)
                                continue;

                            if (activeOnly && isAccountDisabled(de))
                                continue;

                            users.Add(CreateUserFromDirectoryEntry(de));
                        }
                    }
                }
            }
            catch
            {
                throw;
            }

            return users;
        }

        private bool isAccountDisabled(DirectoryEntry entry)
        {
            if (entry.NativeGuid == null) return true;

            int flags = (int)entry.Properties["userAccountControl"].Value;

            return Convert.ToBoolean(flags & 0x0002); //The second bit of userAccountControl will be 1 if the account is disabled.
        }

        /// <summary>
        /// Gets Active Directory user by username
        /// </summary>
        /// <param name="userName"></param>
        /// <returns></returns>
        public ADUser GetUser(string userName)
        {
            ADUser user = null;

            try
            {
                using (var ctx = new PrincipalContext(ContextType.Domain, ADDomain, ADUserName, ADPassword))
                {
                    UserPrincipal qbeUser = new UserPrincipal(ctx);
                    qbeUser.SamAccountName = userName;

                    PrincipalSearcher srch = new PrincipalSearcher(qbeUser);
                    UserPrincipal upr = srch.FindOne() as UserPrincipal;

                    if (upr != null)
                    {
                        DirectoryEntry de = upr.GetUnderlyingObject() as DirectoryEntry;

                        if (de != null)
                            user = CreateUserFromDirectoryEntry(de);
                    }
                }
            }
            catch
            {
                throw;
            }

            return user;
        }

        /// <summary>
        /// Validates Active Directory user's credentials
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        public bool ValidateCredentials(string userName, string password)
        {
            bool isValid = false;

            try
            {
                using (var ctx = new PrincipalContext(ContextType.Domain, ADDomain, ADUserName, ADPassword))
                {
                    isValid = ctx.ValidateCredentials(userName, password);
                }
            }
            catch
            {
                throw;
            }

            return isValid;
        }

        private ADUser CreateUserFromDirectoryEntry(DirectoryEntry de)
        {
            ADUser user = new ADUser
            {
                ObjectGuid = new Guid((byte[])de.Properties["objectGuid"].Value),
                Name = de.Properties["givenName"].Value != null ? de.Properties["givenName"].Value.ToString() : null,
                Surname = de.Properties["sn"].Value != null ? de.Properties["sn"].Value.ToString() : null,
                UserName = de.Properties["samAccountName"].Value != null ? de.Properties["samAccountName"].Value.ToString() : null,
                UserPrincipalName = de.Properties["userPrincipalName"].Value != null ? de.Properties["userPrincipalName"].Value.ToString() : null,
                Email = de.Properties["mail"].Value != null ? de.Properties["mail"].Value.ToString() : null,
                Telephone = de.Properties["mobile"].Value != null ? de.Properties["mobile"].Value.ToString() : null,
                WhenCreated = (DateTime)de.Properties["whenCreated"].Value,
                WhenChanged = de.Properties["whenChanged"].Value != null ? (DateTime?)de.Properties["whenChanged"].Value : null,
                IsDisabled = isAccountDisabled(de),
                WWWHomePage = de.Properties["wWWHomePage"].Value != null ? de.Properties["wWWHomePage"].Value.ToString() : null,
                Department = de.Properties["department"].Value != null ? de.Properties["department"].Value.ToString() : null,
                Company = de.Properties["company"].Value != null ? de.Properties["company"].Value.ToString() : null
            };

            return user;
        }

        /// <summary>
        /// Gets ProjektuValdymas user by Active Directory user's credentials
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        public Naudotojas LogonActiveDirectoryUser(string userName, string password)
        {
            var activeDirectoryUser = GetUser(userName);

            if (activeDirectoryUser == null)
                throw new NevdaValidationException("Naudotojas nerastas");

            if (activeDirectoryUser.IsDisabled)
                throw new NevdaValidationException("Prisijungimas uždraustas");

            if (!ValidateCredentials(userName, password))
                throw new NevdaValidationException("Neteisingas slaptažodis");

            var naudotojas = BllFactory.NaudotojasBll.GetByActiveDirectoryUserGuid(activeDirectoryUser.ObjectGuid);

            if (naudotojas == null)
                naudotojas = BllFactory.NaudotojasBll.CreateNaudotojas(activeDirectoryUser);

            return naudotojas;
        }
    }
}