using System;
using System.Linq;
using System.DirectoryServices;
using System.DirectoryServices.AccountManagement;
using Microsoft.VisualBasic.ApplicationServices;
using Nevda.Kontora.Bll.Interfaces;
using Nevda.Kontora.Bll.Interfaces.Features;
using Nevda.Kontora.Dal.Interfaces;
using Nevda.Kontora.Model;
using Nevda.Kontora.Model.ActiveDirectory;
using Nevda.Kontora.Model.Klasifikatoriai;
using Nevda.Kontora.Model.Subjektai;

namespace Nevda.Kontora.Bll
{
    public class ActiveDirectoryBll : IActiveDirectoryBll
    {
        private readonly ITransactionProvider _transactionProvider;
        private readonly IDabartinisNaudotojasBll _dabartinisNaudotojasBll;
        private readonly IBaseDal<SUBJEKTU_ASMENU_ISTORIJA> _subjektuAsmenuIstorijaDal;
        private readonly IBaseDal<SUBJEKTU_ASMENYS> _subjektuAsmenysDal;
        private readonly IBaseDal<SUBJEKTAI> _subjektaiDal;
        private readonly IBaseDal<AD_DOMAINS> _adDomainsDal;
        private readonly ITerminuNustatymaiBll _terminuNustatymaiBll;

        public ActiveDirectoryBll(IBaseDal<SUBJEKTU_ASMENYS> subjektuAsmenysDal, IBaseDal<AD_DOMAINS> adDomainsDal, IBaseDal<SUBJEKTAI> subjektaiDal,
            IBaseDal<SUBJEKTU_ASMENU_ISTORIJA> subjektuAsmenuIstorijaDal, ITransactionProvider transactionProvider, IDabartinisNaudotojasBll dabartinisNaudotojasBll,
            ITerminuNustatymaiBll terminuNustatymaiBll)
        {
            _subjektuAsmenysDal = subjektuAsmenysDal;
            _adDomainsDal = adDomainsDal;
            _subjektaiDal = subjektaiDal;
            _subjektuAsmenuIstorijaDal = subjektuAsmenuIstorijaDal;
            _transactionProvider = transactionProvider;
            _dabartinisNaudotojasBll = dabartinisNaudotojasBll;
            _terminuNustatymaiBll = terminuNustatymaiBll;
        }

        /// <summary>
        /// Gets DVS user by Active Directory user's credentials
        /// </summary>
        /// <param name="userModel"></param>
        /// <returns></returns>
        public SUBJEKTU_ASMENYS GetActiveDirectoryUser(UserLoginModel userModel)
        {
            var nustatymuSarasas = _terminuNustatymaiBll.GetAll().FirstOrDefault(x => x.kodas == "AUTH_LDAP_USER");

            int arGalimaKurti = nustatymuSarasas != null ? nustatymuSarasas.reiksme.Value : 0;
            var user = _dabartinisNaudotojasBll.GetByName(userModel.UserName, userModel.Password);
            if (arGalimaKurti == 1 && user == null && userModel.AdDomain.HasValue)
            {
                var activeDirectoryUser = GetUser(userModel.UserName, userModel.AdDomain.Value);
                if (activeDirectoryUser != null)
                    user = CreateNaudotojas(activeDirectoryUser, userModel.AdDomain.Value);
            }
            
            return user;
        }
        
        private SUBJEKTU_ASMENYS CreateNaudotojas(ADUser adUser, int domainId)
        {
            var subjektas = new SUBJEKTAI
            {
                SBJ_PAV = string.Format("{0} {1}", adUser.Name, adUser.Surname),
                SBJ_EMAIL = adUser.Email,
                SBJ_SBJT_ID = (int)SubjektuTipai.Darbuotojas,
                SBJ_TELEFONAS = adUser.Telephone,
                SBJ_REG_DATA = adUser.WhenCreated,
                SBJ_DATA_NUO = DateTime.Now
            };
            _subjektaiDal.Add(subjektas);

            var subjektuAsmenys = new SUBJEKTU_ASMENYS
            {
                ASM_LOCAL = true, // jei ne 0 - slaptazodis tikrinamas Active directory,
                ASM_LOGIN = adUser.UserName,
                ASM_GUID = adUser.ObjectGuid.ToString(),
                ASM_VARDAS = adUser.Name,
                ASM_PAVARDE = adUser.Surname,
                ASM_DATA_NUO = DateTime.Now,
                ASM_NTIP_ID = (short?)NaudotojoTipas.Darbuotojas, // 0 - single user, 4 - admin
                ASM_DOMAIN_ID = domainId
            };
            _subjektuAsmenysDal.Add(subjektuAsmenys);

            var istorija = new SUBJEKTU_ASMENU_ISTORIJA
            {
                Subjektas = subjektas,
                SubjektuAsmenys = subjektuAsmenys,
                SBJA_DATA_NUO = DateTime.Now
            };
            _subjektuAsmenuIstorijaDal.Add(istorija);
            _transactionProvider.SaveChangesWithoutLogging();
            return subjektuAsmenys;
        }

        /// <summary>
        /// Gets Active Directory user by username
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="domainId"></param>
        /// <returns></returns>
        public ADUser GetUser(string userName, int domainId)
        {
            AD_DOMAINS domain = _adDomainsDal.GetById(domainId);
            if (domain == null)
                throw new Exception("Domain is not found");

            ADUser user = null;

            try
            {
                using (var ctx = new PrincipalContext(ContextType.Domain, domain.DOMAIN_NAME, domain.DOMAIN_REQUEST_LOGIN, domain.DOMAIN_REQUEST_PASSWORD))
                {
                    UserPrincipal qbeUser = new UserPrincipal(ctx);
                    qbeUser.SamAccountName = userName;
                    qbeUser.Enabled = true;

                    PrincipalSearcher srch = new PrincipalSearcher(qbeUser);
                    UserPrincipal upr = srch.FindOne() as UserPrincipal;

                    if (upr != null && upr.Enabled.HasValue && upr.Enabled == true)
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
        /// <param name="domainId"></param>
        /// <returns></returns>
        public bool ValidateCredentials(string userName, string password, int domainId)
        {
            var domain = _adDomainsDal.GetById(domainId);
            if (domain == null)
                throw new Exception("Nerastas domeinas");

            using (var ctx = new PrincipalContext(ContextType.Domain, domain.DOMAIN_NAME, domain.DOMAIN_REQUEST_LOGIN, domain.DOMAIN_REQUEST_PASSWORD))
            {
                return ctx.ValidateCredentials(userName, password);
            }
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
                IsDisabled = de.Properties["userAccountControl"].Value.ToString() == "514"
            };

            return user;
        }
    }
}
