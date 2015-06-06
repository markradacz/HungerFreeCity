using System;
using System.Collections.Generic;

namespace HFCWebAdmin.Models
{
    public class PersonalShoppingList
    {
        public string ID { get; set; }
        public string UserID { get; set; }
        public string ShoppingListID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Notes { get; set; }
        public bool Enabled { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public virtual ICollection<PersonalShoppingItem> PersonalShoppingItems { get; set; }
    }
}
