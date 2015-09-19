﻿/// <reference path="../../scripts/typings/require.d.ts" />
/// <reference path="../../scripts/typings/jquery.d.ts" />
/// <reference path="../../scripts/typings/kendo.all.d.ts" />
/// <reference path="../../scripts/common.ts" />
module hfc {
    export class usersvm extends kendo.data.ObservableObject {
        public users = new kendo.data.ObservableArray([]);
        public user: any = { email: "", centers: [], roles: [] };
		public canEdit: boolean = false;
		public canView: boolean = false;
		public allRoles: string[] = ["user", "admin", "manager"];
		public centers: any[] = [];

        public showUser(e: any) {
            var listView = $(e.sender.element).data("kendoListView");
            var index = listView.select().index();
            var user = this.users[index];
			this.set("user", user);
			this.set("canView", true);
			this.set("canEdit", false);
        }

		public doAction(e: any): void {
            if (e.id === "edit") {
				this.set("canEdit", true);
			} else if (e.id === "save") {
				// Save the record
				var clone = JSON.parse(JSON.stringify(this.get("user")));	// cheap way to get a deep clone
				clone.lastModified = new Date().toISOString();

				new Firebase(common.FirebaseUrl)
					.child("users")
					.child(clone.userId)
					.set(clone, error => {
						if (error) {
							common.errorToast("Data could not be saved." + error);
						} else {
							common.successToast("User saved successfully.");
						}
						this.set("canEdit", false);
					});
			}
		}

        public init(): void {
        }

        public constructor() {
            super();
			var that = this;
            $.subscribe("loggedIn", (ref: Firebase) => {
                ref.child("users").on("value", data => {
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
                ref.child("centers").on("value", data => {
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