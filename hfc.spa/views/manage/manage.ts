/// <reference path="../../scripts/typings/require.d.ts" />
/// <reference path="../../scripts/typings/jquery.d.ts" />
/// <reference path="../../scripts/typings/kendo.all.d.ts" />
/// <reference path="../../scripts/common.ts" />
module hfc {
    export class managevm extends kendo.data.ObservableObject {
        public toolbarVisible = false;
		public isAdmin = false;
        public needsView: kendo.View;
        public centerView: kendo.View;
        public locationView: kendo.View;
        public blankView = new kendo.View("<div/>");
        public centers = new kendo.data.ObservableArray([]);
        public item: any = { name: "" };

        private layout = new kendo.Layout("<div id='viewContent'/>");

        public doAction(e: any): void {
            if (e.id === "addcenter") {
				if (!this.get("isAdmin")) {
					common.errorToast("Insufficient privilege to create a center. Must be an Admin.");
					return;
				}
				const center = {
					name: " New Center",
					hours: "",
					phone: "",
					site: "",
					address: {},
					needs: [],
					centerinfo: [],
					geometry: {
						coordinates: [-81.7276643, 30.2890513],
						type: "Point"
					},
					lastModified: new Date().toISOString(),
					centerid: kendo.guid(),
					centertype: hfc.common.CenterTypes[0].id
				};

				// first, add the new center to this user's authorized centers
				const user = common.User;
				const centers = user.centers;
				centers.push(center.centerid);
				new Firebase(common.FirebaseUrl)
					.child("users")
					.child(user.userId)
					.child("centers")
					.set(centers, error => {
						if (error) {
							common.errorToast("Error saving: " + error);
						}
					});

				// save the new center to Firebase
				this.set("item", center);
				new Firebase(common.FirebaseUrl)
					.child("centers")
					.push(center, error => {
					if (error) {
						common.errorToast( "Error saving: " + error);
					}					
				});
            }
        }

        public showCenter(e: any) {
            // get the row of the collection to bind to the subviews
            const listView = $(e.sender.element).data("kendoListView");
            const index = listView.select().index();
            const item = this.centers[index];
			this.set("item", item);

			$("#centerlist button.confirmRemove").each(function () {
                const op = $(this).css("opacity");
                if (op > "0") {
                    $(this).animate({ width: 0, height: "100%", opacity: 0 }, 200);
                }
            });

            (<needsvm>this.needsView.model).setup(item, this.centers);
            (<centervm>this.centerView.model).setup(item);
            (<locationvm>this.locationView.model).setup(item);

            // select the Needs button in the toolbar if there isn't anything selected
            const tabtoolbar = $("#tabtoolbar").data("kendoToolBar");
			const selected = tabtoolbar.getSelectedFromGroup("tab");
			if (selected.length === 0) {
				tabtoolbar.toggle("#needs", true);
				this.tabView("needs");
			} else {
				this.tabView(selected.attr("id"));
			}
            this.set("toolbarVisible", true);
        }

		public onShowRemove(e: any): void {
            const listView = $("#centerlist").data("kendoListView");
            const elem = listView.select()[0];
			$(elem)
				.find(".confirmRemove")
				.animate({ width: "70px", height: "100%", opacity: 1.0 }, 400);
        }

		public onRemove(e: any): void {
            // find which item is selected
            const listView = $("#centerlist").data("kendoListView");
            const index = listView.select().index();
            const item = this.centers[index];

			this.layout.showIn("#viewContent", this.blankView, "swap");
			this.set("toolbarVisible", false);

			// remove on Firebase (and it will remove from centers list by callback)
			new Firebase(common.FirebaseUrl)
				.child(item.refkey)
				.set(null); // remove the item
		}

		public tabToggle(e: any): void {
			this.tabView(e.id);
        }

		public tabView(id: string): void {
			switch (id) {
				case "needs": this.layout.showIn("#viewContent", this.needsView, "swap"); break;
				case "center": this.layout.showIn("#viewContent", this.centerView, "swap"); break;
				case "location": this.layout.showIn("#viewContent", this.locationView); break;
			}
		}

		public listBound(e: any): void {
			// called for each row bound!
			// if we have an item selected, then re-select it after a data refresh
			const curr = this.get("item");
			if (!curr) return;
			const listView = $("#centerlist").data("kendoListView");
			if (!listView) return;
			const all = listView.dataItems();
			const idx = $.indexByPropertyValue(all, "centerid", curr.centerid);
			if (idx >= 0) {
				const sel = listView.element.children()[idx];
				listView.select(sel);
			}
		}

        public init(): void {
			//super.init();
            this.layout.render("#tabContent");
        }

        public constructor() {
            super();
			var that = this;
            $.subscribe("loggedIn", (ref: Firebase) => {
				const isadmin = hfc.common.hasRole("admin");
				this.set("isAdmin", isadmin);

                ref.child("centers").on("value", data => {
					that.centers.length = 0;	// clear the current array
                    // join in the user's centers, and add each to the collection
                    if (common.User) {
						var key = data.key();
	                    var all = [];
						// convert object to an array
						data.forEach(v => {
							var c = v.val();
							c.refkey = key + "/" + v.key();
                            c.canEdit = isadmin || $.inArray(c.centerid, hfc.common.User.centers) >= 0;
							if (!c.needs) c.needs = [];
							if (!c.centertype) c.centertype = hfc.common.CenterTypes[0].id;
							c.onShowRemove = e => { this.onShowRemove(e); }
							c.onRemove = e => { this.onRemove(e); }
							c.isAdmin = this.get("isAdmin");
							all.push(c);
						});
						all.sort((a: any, b: any) => {
							return a.name.localeCompare(b.name);
						});
                        all.forEach(v => {
							if(v.canEdit) that.centers.push(v);
                        });
                    }
                });
            });
        }
    }
}

define([
    "text!/views/manage/manage.html",
    "/views/needs/needs.js",
    "/views/center/center.js",
    "/views/location/location.js"
], (template, needs, center, location) => {
    var vm = new hfc.managevm();
    vm.needsView = needs;
    vm.centerView = center;
    vm.locationView = location;

    return new kendo.View(template, {
        model: vm,
        show() { hfc.common.animate(this.element); },
        init() { vm.init(); }
    });
});