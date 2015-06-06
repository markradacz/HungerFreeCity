namespace HFCWebAdmin.Migrations
{
	using System.Data.Entity.Migrations;
    
    public partial class initial : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.PantryItems",
                c => new
                    {
                        ID = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        Description = c.String(),
                        UPC = c.String(),
                        Notes = c.String(),
                        Enabled = c.Boolean(nullable: false),
                        StatusCode = c.String(),
                        QtyOnHand = c.Int(nullable: false),
                        Picture = c.String(),
                        CreatedAt = c.DateTime(nullable: false),
                        UpdatedAt = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.ID);
            
            CreateTable(
                "dbo.PersonalShoppingItems",
                c => new
                    {
                        ID = c.String(nullable: false, maxLength: 128),
                        PersonalShoppingListID = c.String(maxLength: 128),
                        PantryItemID = c.String(),
                        Notes = c.String(),
                        Enabled = c.Boolean(nullable: false),
                        QtyDelivered = c.Int(nullable: false),
                        QtyPurchased = c.Int(nullable: false),
                        QtyRequested = c.Int(nullable: false),
                        Picture = c.String(),
                        DatePurchased = c.DateTime(nullable: false),
                        DateDelivered = c.DateTime(nullable: false),
                        CreatedAt = c.DateTime(nullable: false),
                        UpdatedAt = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.ID)
                .ForeignKey("dbo.ShoppingLists", t => t.ID)
                .ForeignKey("dbo.PersonalShoppingLists", t => t.PersonalShoppingListID)
                .Index(t => t.ID)
                .Index(t => t.PersonalShoppingListID);
            
            CreateTable(
                "dbo.ShoppingLists",
                c => new
                    {
                        ID = c.String(nullable: false, maxLength: 128),
                        Name = c.String(),
                        Description = c.String(),
                        Notes = c.String(),
                        IsPublished = c.Boolean(nullable: false),
                        Enabled = c.Boolean(nullable: false),
                        DateFrom = c.DateTime(nullable: false),
                        DateTo = c.DateTime(nullable: false),
                        CreatedAt = c.DateTime(nullable: false),
                        UpdatedAt = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.ID);
            
            CreateTable(
                "dbo.ShoppingItems",
                c => new
                    {
                        ID = c.String(nullable: false, maxLength: 128),
                        ShoppingListID = c.String(),
                        PantryItemID = c.String(),
                        Notes = c.String(),
                        Enabled = c.Boolean(nullable: false),
                        QtyRequested = c.Int(nullable: false),
                        QtyOnHand = c.Int(nullable: false),
                        QtyPromissed = c.Int(nullable: false),
                        CreatedAt = c.DateTime(nullable: false),
                        UpdatedAt = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.ID)
                .ForeignKey("dbo.ShoppingLists", t => t.ID)
                .Index(t => t.ID);
            
            CreateTable(
                "dbo.PersonalShoppingLists",
                c => new
                    {
                        ID = c.String(nullable: false, maxLength: 128),
                        UserID = c.String(),
                        ShoppingListID = c.String(),
                        Name = c.String(),
                        Description = c.String(),
                        Notes = c.String(),
                        Enabled = c.Boolean(nullable: false),
                        CreatedAt = c.DateTime(nullable: false),
                        UpdatedAt = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.ID);
            
            CreateTable(
                "dbo.AspNetRoles",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        Name = c.String(nullable: false, maxLength: 256),
                    })
                .PrimaryKey(t => t.Id)
                .Index(t => t.Name, unique: true, name: "RoleNameIndex");
            
            CreateTable(
                "dbo.AspNetUserRoles",
                c => new
                    {
                        UserId = c.String(nullable: false, maxLength: 128),
                        RoleId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.UserId, t.RoleId })
                .ForeignKey("dbo.AspNetRoles", t => t.RoleId, cascadeDelete: true)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId)
                .Index(t => t.RoleId);
            
            CreateTable(
                "dbo.AspNetUsers",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        Email = c.String(maxLength: 256),
                        EmailConfirmed = c.Boolean(nullable: false),
                        PasswordHash = c.String(),
                        SecurityStamp = c.String(),
                        PhoneNumber = c.String(),
                        PhoneNumberConfirmed = c.Boolean(nullable: false),
                        TwoFactorEnabled = c.Boolean(nullable: false),
                        LockoutEndDateUtc = c.DateTime(),
                        LockoutEnabled = c.Boolean(nullable: false),
                        AccessFailedCount = c.Int(nullable: false),
                        UserName = c.String(nullable: false, maxLength: 256),
                    })
                .PrimaryKey(t => t.Id)
                .Index(t => t.UserName, unique: true, name: "UserNameIndex");
            
            CreateTable(
                "dbo.AspNetUserClaims",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.String(nullable: false, maxLength: 128),
                        ClaimType = c.String(),
                        ClaimValue = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.AspNetUserLogins",
                c => new
                    {
                        LoginProvider = c.String(nullable: false, maxLength: 128),
                        ProviderKey = c.String(nullable: false, maxLength: 128),
                        UserId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.LoginProvider, t.ProviderKey, t.UserId })
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.AspNetUserRoles", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserLogins", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserClaims", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserRoles", "RoleId", "dbo.AspNetRoles");
            DropForeignKey("dbo.PersonalShoppingItems", "PersonalShoppingListID", "dbo.PersonalShoppingLists");
            DropForeignKey("dbo.PersonalShoppingItems", "ID", "dbo.ShoppingLists");
            DropForeignKey("dbo.ShoppingItems", "ID", "dbo.ShoppingLists");
            DropIndex("dbo.AspNetUserLogins", new[] { "UserId" });
            DropIndex("dbo.AspNetUserClaims", new[] { "UserId" });
            DropIndex("dbo.AspNetUsers", "UserNameIndex");
            DropIndex("dbo.AspNetUserRoles", new[] { "RoleId" });
            DropIndex("dbo.AspNetUserRoles", new[] { "UserId" });
            DropIndex("dbo.AspNetRoles", "RoleNameIndex");
            DropIndex("dbo.ShoppingItems", new[] { "ID" });
            DropIndex("dbo.PersonalShoppingItems", new[] { "PersonalShoppingListID" });
            DropIndex("dbo.PersonalShoppingItems", new[] { "ID" });
            DropTable("dbo.AspNetUserLogins");
            DropTable("dbo.AspNetUserClaims");
            DropTable("dbo.AspNetUsers");
            DropTable("dbo.AspNetUserRoles");
            DropTable("dbo.AspNetRoles");
            DropTable("dbo.PersonalShoppingLists");
            DropTable("dbo.ShoppingItems");
            DropTable("dbo.ShoppingLists");
            DropTable("dbo.PersonalShoppingItems");
            DropTable("dbo.PantryItems");
        }
    }
}
