/// <reference path='../../scripts/typings/jquery.d.ts' />
/// <reference path='../../scripts/typings/kendo.all.d.ts' />
/// <reference path='../../scripts/common.ts' />
module hfc {
    export class homevm extends kendo.data.ObservableObject {
        public title: string = "Home";
        public loggedIn: boolean = false;
        public centers = new kendo.data.ObservableArray([]);

        public doLogin(e: any): void {
            $.publish("showLogin");
        }

        public doRegister(e: any): void {
            $.publish("showRegister");
        }

        public init(): void {
			//super.init();
            $.subscribe("loggedIn", () => { this.set("loggedIn", true); });
            $.subscribe("loggedOff", () => { this.set("loggedIn", false); });
            this.set("loggedIn", common.User ? true : false);
        }

		public constructor() {
            super();
			var that = this;
            $.subscribe("loggedIn", (ref: Firebase) => {
                ref.child("centers").on("value", data => {
					that.centers.length = 0;	// clear the current array
                    // join in the user's favorited centers, and add each to the collection
                    if (common.User) {
						var all = [];
						// convert object to an array
						data.forEach(v => {
							var c = v.val();
                            c.favorite = $.inArray(c.centerid, common.User.favorites) >= 0;
							if (!c.needs) c.needs = [];
							all.push(c);
						});
						all.sort((a: any, b: any) => {
							if (a.favorite === b.favorite) return a.name.localeCompare(b.name);
							return a.favorite ? -1 : 1;
						});
                        all.forEach(v => {
							that.centers.push(v);
                        });
                    }
                });
            });

			that.centers.bind("change", e => {
				if (e.action === "itemchange" && e.field === "favorite") {
					// so change the user's favorites and persist
					hfc.common.User.favorites = that.centers
						.filter((v: any) => v.favorite)
						.map((v: any) => v.centerid);
					//hfc.common.log("favorites are " + JSON.stringify(common.User.favorites));
					$.publish("saveFavorites");
				}
			});
        }
    }
}

define([
    "text!/views/home/home.html"
], homeTemplate => {
    var vm: hfc.homevm = new hfc.homevm();
    var view: kendo.View = new kendo.View(homeTemplate, {
        model: vm,
        show() { hfc.common.animate(this.element); },
        init() { vm.init(); }
    });
    return view;
});