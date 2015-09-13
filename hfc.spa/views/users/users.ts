/// <reference path="../../scripts/typings/require.d.ts" />
/// <reference path="../../scripts/typings/jquery.d.ts" />
/// <reference path="../../scripts/typings/kendo.all.d.ts" />
/// <reference path="../../scripts/common.ts" />
module hfc {
    export class usersvm extends kendo.data.ObservableObject {
        public users = new kendo.data.ObservableArray([]);
        public user: any = { email: "" };

        public showUser(e: any) {
            // get the row of the collection to bind to the subviews
            var listView = $(e.sender.element).data("kendoListView");
            var index = listView.select().index();
            var user = this.users[index];
			this.set("user", user);
        }

        public init(): void {
        }

        public constructor() {
            super();
			var that = this;
            $.subscribe("loggedIn", (ref: Firebase) => {
                ref.child("users").on("value", data => {
					that.users.length = 0;	// clear the current array
                    // join in the user's favorited centers, and add each to the collection
                    if (common.User && common.User.favorites) {
						var key = data.key();
	                    var all = [];
						// convert object to an array
						data.forEach(v => {
							var u = v.val();
							u.refkey = key + "/" + v.key();
							if (!u.roles) u.roles = ["user"];
							all.push(u);
						});
						all.sort((a: any, b: any) => {
							return a.email.localeCompare(b.email);
						});
                        all.forEach( v => { that.users.push(v); });
                    }
                });
            });
        }
    }
}

define([
    "text!views/users/users.html"
], template => {
    var vm = new hfc.usersvm();

    return new kendo.View(template, {
        model: vm,
        show() { hfc.common.animate(this.element, "slideUp"); },
        init() { vm.init(); }
    });
});