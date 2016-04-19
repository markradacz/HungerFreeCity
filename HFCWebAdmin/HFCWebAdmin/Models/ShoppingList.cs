using System;
using System.Collections.Generic;

namespace HFCWebAdmin.Models
{
    public class ShoppingList
    {
        public string ID { get; set; }
        public int FoodDistributorID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Notes { get; set; }
        public bool IsPublished { get; set; }
        public bool Enabled { get; set; }
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public virtual  ICollection<ShoppingItem> ShoppingItems { get; set; }

    }
}
