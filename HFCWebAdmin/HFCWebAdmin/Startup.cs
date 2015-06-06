using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(HFCWebAdmin.Startup))]
namespace HFCWebAdmin
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
