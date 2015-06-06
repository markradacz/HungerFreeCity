namespace HFCWebAdmin.Migrations
{
    using HFCWebAdmin.Models;
    using System.Collections.Generic;
    using System.Data.Entity.Migrations;

	internal sealed class Configuration : DbMigrationsConfiguration<HFCWebAdmin.Models.ApplicationDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(HFCWebAdmin.Models.ApplicationDbContext context)
        {
            //  This method will be called after migrating to the latest version.

            var pantryItems = new List<PantryItem>
            {
                new PantryItem { Name = "Rice" }, 
                new PantryItem { Name = "Pasta" }, 
                new PantryItem { Name = "Mac & Cheese" }, 
                new PantryItem { Name = "Instant Rice" }, 
                new PantryItem { Name = "Ramen Noodles" }, 
                new PantryItem { Name = "Canned Vegetables" }, 
                new PantryItem { Name = "Canned Fruit" }, 
                new PantryItem { Name = "Canned Soup" }, 
                new PantryItem { Name = "Baked Beans" }, 
                new PantryItem { Name = "Canned Chicken" }, 
                new PantryItem { Name = "Instant Oatmeal" }, 
                new PantryItem { Name = "Cereal" }, 
                new PantryItem { Name = "Pop Tarts" }, 
                new PantryItem { Name = "Peanut Butter" }, 
                new PantryItem { Name = "Jelly" }, 
                new PantryItem { Name = "Ketchup" }, 
               new PantryItem { Name = "Mustard" }, 
                new PantryItem { Name = "Salad Dressing" }, 
                new PantryItem { Name = "Cooking Oil 30 oz" }, 
                new PantryItem { Name = "Dry Beans" }, 
                new PantryItem { Name = "Dish Souap 25 oz" }, 
                new PantryItem { Name = "Laundry Soap" }, 
               new PantryItem { Name = "Trash Bags 13.30 Gal" }, 
                new PantryItem { Name = "Paper Towels" }, 
                new PantryItem { Name = "Fabric Softener" }
             };

            pantryItems.ForEach(bm => context.PantryItems.AddOrUpdate(b => b.Name, bm));
            context.SaveChanges();
        }
    }
}
