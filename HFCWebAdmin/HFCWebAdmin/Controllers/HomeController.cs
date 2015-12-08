using System.Web.Mvc;

namespace HFCWebAdmin.Controllers
{
	public class HomeController : Controller
	{
		public ActionResult Index()
		{
			return View();
		}

		public ActionResult About()
		{
			ViewBag.Message = "Connect people in the community, local food banks and charities in order to end hunger in their city.";

			return View();
		}

		public ActionResult Contact()
		{
			ViewBag.Message = "Join us to end hunger in your city.";

			return View();
		}
	}
}