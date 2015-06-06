using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Net;
using System.Web;
using System.Web.Mvc;
using HFCWebAdmin.Models;

namespace HFCWebAdmin.Controllers
{
    public class ShoppingListsController : Controller
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: ShoppingLists
        public async Task<ActionResult> Index()
        {
            var shoppingLists = db.ShoppingLists.Include(s => s.ShoppingItems);
            return View(await shoppingLists.ToListAsync());
        }

        // GET: ShoppingLists/Details/5
        public async Task<ActionResult> Details(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            ShoppingList shoppingList = await db.ShoppingLists.FindAsync(id);
            if (shoppingList == null)
            {
                return HttpNotFound();
            }
            return View(shoppingList);
        }

        // GET: ShoppingLists/Create
        public ActionResult Create()
        {
            ViewBag.ID = new SelectList(db.ShoppingItems, "ID", "ShoppingListID");
            return View();
        }

        // POST: ShoppingLists/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include = "ID,Name,Description,Notes,IsPublished,Enabled,DateFrom,DateTo,CreatedAt,UpdatedAt")] ShoppingList shoppingList)
        {
            if (ModelState.IsValid)
            {
                db.ShoppingLists.Add(shoppingList);
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }

            ViewBag.ID = new SelectList(db.ShoppingItems, "ID", "ShoppingListID", shoppingList.ID);
            return View(shoppingList);
        }

        // GET: ShoppingLists/Edit/5
        public async Task<ActionResult> Edit(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            ShoppingList shoppingList = await db.ShoppingLists.FindAsync(id);
            if (shoppingList == null)
            {
                return HttpNotFound();
            }
            ViewBag.ID = new SelectList(db.ShoppingItems, "ID", "ShoppingListID", shoppingList.ID);
            return View(shoppingList);
        }

        // POST: ShoppingLists/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include = "ID,Name,Description,Notes,IsPublished,Enabled,DateFrom,DateTo,CreatedAt,UpdatedAt")] ShoppingList shoppingList)
        {
            if (ModelState.IsValid)
            {
                db.Entry(shoppingList).State = EntityState.Modified;
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            ViewBag.ID = new SelectList(db.ShoppingItems, "ID", "ShoppingListID", shoppingList.ID);
            return View(shoppingList);
        }

        // GET: ShoppingLists/Delete/5
        public async Task<ActionResult> Delete(string id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            ShoppingList shoppingList = await db.ShoppingLists.FindAsync(id);
            if (shoppingList == null)
            {
                return HttpNotFound();
            }
            return View(shoppingList);
        }

        // POST: ShoppingLists/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(string id)
        {
            ShoppingList shoppingList = await db.ShoppingLists.FindAsync(id);
            db.ShoppingLists.Remove(shoppingList);
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
