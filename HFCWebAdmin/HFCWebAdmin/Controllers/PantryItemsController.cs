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
    public class PantryItemsController : Controller
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: PantryItems
        public async Task<ActionResult> Index()
        {
            return View(await db.PantryItems.ToListAsync());
        }

        // GET: PantryItems/Details/5
        public async Task<ActionResult> Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            PantryItem pantryItem = await db.PantryItems.FindAsync(id);
            if (pantryItem == null)
            {
                return HttpNotFound();
            }
            return View(pantryItem);
        }

        // GET: PantryItems/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: PantryItems/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include = "ID,Name,Description,UPC,Notes,Enabled,StatusCode,QtyOnHand,Picture,CreatedAt,UpdatedAt")] PantryItem pantryItem)
        {
            if (ModelState.IsValid)
            {
                db.PantryItems.Add(pantryItem);
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }

            return View(pantryItem);
        }

        // GET: PantryItems/Edit/5
        public async Task<ActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            PantryItem pantryItem = await db.PantryItems.FindAsync(id);
            if (pantryItem == null)
            {
                return HttpNotFound();
            }
            return View(pantryItem);
        }

        // POST: PantryItems/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include = "ID,Name,Description,UPC,Notes,Enabled,StatusCode,QtyOnHand,Picture,CreatedAt,UpdatedAt")] PantryItem pantryItem)
        {
            if (ModelState.IsValid)
            {
                db.Entry(pantryItem).State = EntityState.Modified;
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            return View(pantryItem);
        }

        // GET: PantryItems/Delete/5
        public async Task<ActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            PantryItem pantryItem = await db.PantryItems.FindAsync(id);
            if (pantryItem == null)
            {
                return HttpNotFound();
            }
            return View(pantryItem);
        }

        // POST: PantryItems/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(int id)
        {
            PantryItem pantryItem = await db.PantryItems.FindAsync(id);
            db.PantryItems.Remove(pantryItem);
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
