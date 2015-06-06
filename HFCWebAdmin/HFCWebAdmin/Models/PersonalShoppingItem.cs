using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace HFCWebAdmin.Models
{
    public class PersonalShoppingItem
    {
        public string ID { get; set; }
        public string PersonalShoppingListID { get; set; }
        public string PantryItemID { get; set; }
        public string Notes { get; set; }
        public bool Enabled { get; set; }

        public int QtyDelivered { get; set; }
        public int QtyPurchased { get; set; }
        public int QtyRequested { get; set; }
        public string Picture { get; set; }
        public DateTime DatePurchased { get; set; }
        public DateTime DateDelivered { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        [ForeignKey("ID")]
        public ShoppingList ShoppingList { get; set; }
    }
}
