using System.Data.Entity;
using System.Threading.Tasks;
using System.Net;
using System.Web.Mvc;
using HFCWebAdmin.Models;

namespace HFCWebAdmin.Controllers
{
    public class ShoppingItemsController : Controller
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: ShoppingItems
        public async Task<ActionResult> Index()
        {
            var shoppingItems = db.ShoppingItems.Include(s => s.ShoppingList);
            return View(await shoppingItems.ToListAsync());
        }

        // GET: ShoppingItems/Details/5
        public async Task<ActionResult> Details(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            ShoppingItem shoppingItem = await db.ShoppingItems.FindAsync(id);
            if (shoppingItem == null)
            {
                return HttpNotFound();
            }
            return View(shoppingItem);
        }

        // GET: ShoppingItems/Create
        public ActionResult Create()
        {
            ViewBag.ID = new SelectList(db.ShoppingLists, "ID", "Name");
            return View();
        }

        // POST: ShoppingItems/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include = "ID,ShoppingListID,PantryItemID,Notes,Enabled,QtyRequested,QtyOnHand,QtyPromissed,CreatedAt,UpdatedAt")] ShoppingItem shoppingItem)
        {
            if (ModelState.IsValid)
            {
                db.ShoppingItems.Add(shoppingItem);
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }

            ViewBag.ID = new SelectList(db.ShoppingLists, "ID", "Name", shoppingItem.ID);
            return View(shoppingItem);
        }

        // GET: ShoppingItems/Edit/5
        public async Task<ActionResult> Edit(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            ShoppingItem shoppingItem = await db.ShoppingItems.FindAsync(id);
            if (shoppingItem == null)
            {
                return HttpNotFound();
            }
            ViewBag.ID = new SelectList(db.ShoppingLists, "ID", "Name", shoppingItem.ID);
            return View(shoppingItem);
        }

        // POST: ShoppingItems/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include = "ID,ShoppingListID,PantryItemID,Notes,Enabled,QtyRequested,QtyOnHand,QtyPromissed,CreatedAt,UpdatedAt")] ShoppingItem shoppingItem)
        {
            if (ModelState.IsValid)
            {
                db.Entry(shoppingItem).State = EntityState.Modified;
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            ViewBag.ID = new SelectList(db.ShoppingLists, "ID", "Name", shoppingItem.ID);
            return View(shoppingItem);
        }

        // GET: ShoppingItems/Delete/5
        public async Task<ActionResult> Delete(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            ShoppingItem shoppingItem = await db.ShoppingItems.FindAsync(id);
            if (shoppingItem == null)
            {
                return HttpNotFound();
            }
            return View(shoppingItem);
        }

        // POST: ShoppingItems/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(string id)
        {
            ShoppingItem shoppingItem = await db.ShoppingItems.FindAsync(id);
            db.ShoppingItems.Remove(shoppingItem);
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
