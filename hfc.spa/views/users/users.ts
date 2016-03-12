/// <reference path="../../scripts/typings/require.d.ts" />
/// <reference path="../../scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../../scripts/typings/kendo-ui/kendo-ui.d.ts" />
/// <reference path="../../scripts/common.ts" />
module hfc {
    export class usersvm extends kendo.data.ObservableObject {
        public users = new kendo.data.ObservableArray([]);
        public user: any = { email: "", centers: [], roles: [] };
		public canEdit = false;
		public canView = false;
		public allRoles: string[] = ["user", "admin", "manager"];
		public centers: any[] = [];

        public showUser(e: any) {
	        const listView = $(e.sender.element).data("kendoListView");
			const index = listView.select().index();
            const user = this.users[index];
			this.set("user", user);
			this.set("canView", true);
			this.set("canEdit", false);
        }

		public doAction(e: any): void {
            if (e.id === "edit") {
				this.set("canEdit", true);
			} else if (e.id === "save") {
				// Save the record
				const clone = JSON.parse(JSON.stringify(this.get("user")));	// cheap way to get a deep clone
				clone.lastModified = new Date().toISOString();

				common.firebase
					.child("users")
					.child(clone.userId)
					.set(clone)
					.then( () => {
						common.successToast("User saved successfully.");		            
					})
					.catch( error => {
						common.errorToast("Data could not be saved." + error);
					})
					.then( () => {
						this.set("canEdit", false);
					});
			}
		}

        public init(): void {
        }

        public constructor() {
            super();
			var that = this;
            $.subscribe("loggedIn", () => {
                common.firebase.child("users").on("value", data => {
					// convert object to an array
	                var all = [];
					data.forEach(v => {
						var u = v.val();
						if (!u.roles) u.roles = ["user"];
						if (!u.centers) u.centers = [];
						all.push(u);
					});
					all.sort((a: any, b: any) => {
						return a.email.localeCompare(b.email);
					});
					that.users.length = 0;	// clear the current array
                    all.forEach( v => { that.users.push(v); });
                });

                common.firebase.child("centers").on("value", data => {
					// convert object to an array
					var all = [];
					data.forEach(v => {
						var c = v.val();
						all.push(c);
					});
					all.sort((a: any, b: any) => {
						return a.name.localeCompare(b.name);
					});
					that.centers.length = 0;	// clear the current array
                    all.forEach(v => { that.centers.push(v); });
                });
			});
        }
    }
}

define([
    "text!/views/users/users.html"
], template => {
    var vm = new hfc.usersvm();
    return new kendo.View(template, {
        model: vm,
        show() { hfc.common.animate(this.element); },
        init() { vm.init(); }
    });
});