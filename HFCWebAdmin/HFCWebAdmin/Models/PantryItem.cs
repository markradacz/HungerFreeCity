using Newtonsoft.Json;
using System;

namespace HFCWebAdmin.Models
{
    public class PantryItem
    {
        public int ID { get; set; }
        public int FoodDistributorID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string UPC { get; set; }
        public string Notes { get; set; }
        public bool Enabled { get; set; }

        public string StatusCode { get; set; }
        public int QtyOnHand { get; set; }
        public string Picture { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        [JsonIgnore]
        public string CreatedDate { get { return CreatedAt.ToString("g"); } }
        [JsonIgnore]
        public string UpdatedDate { get { return UpdatedAt.ToString("g"); } }
 
    }
}
