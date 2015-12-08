using System.Data.Entity;
using System.Threading.Tasks;
using System.Net;
using System.Web.Mvc;
using HFCWebAdmin.Models;

namespace HFCWebAdmin.Controllers
{
    public class PersonalShoppingItemsController : Controller
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: PersonalShoppingItems
        public async Task<ActionResult> Index()
        {
            var personalShoppingItems = db.PersonalShoppingItems.Include(p => p.ShoppingList);
            return View(await personalShoppingItems.ToListAsync());
        }

        // GET: PersonalShoppingItems/Details/5
        public async Task<ActionResult> Details(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            PersonalShoppingItem personalShoppingItem = await db.PersonalShoppingItems.FindAsync(id);
            if (personalShoppingItem == null)
            {
                return HttpNotFound();
            }
            return View(personalShoppingItem);
        }

        // GET: PersonalShoppingItems/Create
        public ActionResult Create()
        {
            ViewBag.ID = new SelectList(db.ShoppingLists, "ID", "Name");
            return View();
        }

        // POST: PersonalShoppingItems/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include = "ID,PersonalShoppingListID,PantryItemID,Notes,Enabled,QtyDelivered,QtyPurchased,QtyRequested,Picture,DatePurchased,DateDelivered,CreatedAt,UpdatedAt")] PersonalShoppingItem personalShoppingItem)
        {
            if (ModelState.IsValid)
            {
                db.PersonalShoppingItems.Add(personalShoppingItem);
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }

            ViewBag.ID = new SelectList(db.ShoppingLists, "ID", "Name", personalShoppingItem.ID);
            return View(personalShoppingItem);
        }

        // GET: PersonalShoppingItems/Edit/5
        public async Task<ActionResult> Edit(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            PersonalShoppingItem personalShoppingItem = await db.PersonalShoppingItems.FindAsync(id);
            if (personalShoppingItem == null)
            {
                return HttpNotFound();
            }
            ViewBag.ID = new SelectList(db.ShoppingLists, "ID", "Name", personalShoppingItem.ID);
            return View(personalShoppingItem);
        }

        // POST: PersonalShoppingItems/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include = "ID,PersonalShoppingListID,PantryItemID,Notes,Enabled,QtyDelivered,QtyPurchased,QtyRequested,Picture,DatePurchased,DateDelivered,CreatedAt,UpdatedAt")] PersonalShoppingItem personalShoppingItem)
        {
            if (ModelState.IsValid)
            {
                db.Entry(personalShoppingItem).State = EntityState.Modified;
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            ViewBag.ID = new SelectList(db.ShoppingLists, "ID", "Name", personalShoppingItem.ID);
            return View(personalShoppingItem);
        }

        // GET: PersonalShoppingItems/Delete/5
        public async Task<ActionResult> Delete(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            PersonalShoppingItem personalShoppingItem = await db.PersonalShoppingItems.FindAsync(id);
            if (personalShoppingItem == null)
            {
                return HttpNotFound();
            }
            return View(personalShoppingItem);
        }

        // POST: PersonalShoppingItems/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(string id)
        {
            PersonalShoppingItem personalShoppingItem = await db.PersonalShoppingItems.FindAsync(id);
            db.PersonalShoppingItems.Remove(personalShoppingItem);
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
