using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;

namespace HFCWebAdmin.Models
{
    public class ShoppingItem
    {
        public string ID { get; set; }
        public string ShoppingListID { get; set; }
        public string PantryItemID { get; set; }
        public string Notes { get; set; }
        public bool Enabled { get; set; }

        public int QtyRequested { get; set; }
        public int QtyOnHand { get; set; }
        public int QtyPromissed { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        [ForeignKey("ID")]
        public ShoppingList ShoppingList { get; set; }

    }
}
