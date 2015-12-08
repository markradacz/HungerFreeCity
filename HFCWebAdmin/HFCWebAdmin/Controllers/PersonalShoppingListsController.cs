using System.Data.Entity;
using System.Threading.Tasks;
using System.Net;
using System.Web.Mvc;
using HFCWebAdmin.Models;

namespace HFCWebAdmin.Controllers
{
    public class PersonalShoppingListsController : Controller
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: PersonalShoppingLists
        public async Task<ActionResult> Index()
        {
            return View(await db.PersonalShoppingLists.ToListAsync());
        }

        // GET: PersonalShoppingLists/Details/5
        public async Task<ActionResult> Details(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            PersonalShoppingList personalShoppingList = await db.PersonalShoppingLists.FindAsync(id);
            if (personalShoppingList == null)
            {
                return HttpNotFound();
            }
            return View(personalShoppingList);
        }

        // GET: PersonalShoppingLists/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: PersonalShoppingLists/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include = "ID,UserID,ShoppingListID,Name,Description,Notes,Enabled,CreatedAt,UpdatedAt")] PersonalShoppingList personalShoppingList)
        {
            if (ModelState.IsValid)
            {
                db.PersonalShoppingLists.Add(personalShoppingList);
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }

            return View(personalShoppingList);
        }

        // GET: PersonalShoppingLists/Edit/5
        public async Task<ActionResult> Edit(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            PersonalShoppingList personalShoppingList = await db.PersonalShoppingLists.FindAsync(id);
            if (personalShoppingList == null)
            {
                return HttpNotFound();
            }
            return View(personalShoppingList);
        }

        // POST: PersonalShoppingLists/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include = "ID,UserID,ShoppingListID,Name,Description,Notes,Enabled,CreatedAt,UpdatedAt")] PersonalShoppingList personalShoppingList)
        {
            if (ModelState.IsValid)
            {
                db.Entry(personalShoppingList).State = EntityState.Modified;
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            return View(personalShoppingList);
        }

        // GET: PersonalShoppingLists/Delete/5
        public async Task<ActionResult> Delete(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            PersonalShoppingList personalShoppingList = await db.PersonalShoppingLists.FindAsync(id);
            if (personalShoppingList == null)
            {
                return HttpNotFound();
            }
            return View(personalShoppingList);
        }

        // POST: PersonalShoppingLists/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(string id)
        {
            PersonalShoppingList personalShoppingList = await db.PersonalShoppingLists.FindAsync(id);
            db.PersonalShoppingLists.Remove(personalShoppingList);
            await db.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
