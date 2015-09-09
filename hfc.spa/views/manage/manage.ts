/// <reference path="../../scripts/typings/require.d.ts" />
/// <reference path="../../scripts/typings/jquery.d.ts" />
/// <reference path="../../scripts/typings/kendo.all.d.ts" />
/// <reference path="../../scripts/common.ts" />
module hfc {
    export class managevm extends kendo.data.ObservableObject {
        public title = "Manage";
        public toolbarVisible = false;
        public needsView: kendo.View;
        public centerView: kendo.View;
        public locationView: kendo.View;
        public blankView = new kendo.View("<div/>");
        public centers = new kendo.data.ObservableArray([]);

        private layout = new kendo.Layout("<div id='viewConent'/>");

        public doAction(e: any): void {
            if (e.id === "addcenter") {
				var center = {
					name: "  New Center",
					hours: "",
					lastModified: new Date().toISOString(),
					phone: "",
					site: "",
					centerid: kendo.guid(),
					address: {},
					needs: [],
					centerinfo: [],
					geometry: {
						coordinates: [-81.7276643, 30.2890513],
						type: "Point"
					},
					onShowRemove: e => { this.onShowRemove(e); },
					onRemove: e => { this.onRemove(e); }
				};
                this.centers.unshift(center);
				// now select the newly added center
				var listView = $("#centerlist").data("kendoListView");
				listView.select(listView.element.children().first());
            }
			// savecenter
			// var i2 = listView.select().index();
			// var c2 = this.centers[i2];
			// common.log("saving center data " + JSON.stringify(c2));
			// var ref = this.get("ref");
			// ref.child("centers").child(index).set(center);
        }

        public showCenter(e: any) {
            // get the row of the collection to bind to the subviews
            var listView = $(e.sender.element).data("kendoListView");
            var index = listView.select().index();
            var item = this.centers[index];

			$("#centerlist button.confirmRemove").each(function () {
                var op = $(this).css("opacity");
                if (op > "0") {
                    $(this).animate({ width: 0, height: "100%", opacity: 0 }, 200);
					// display: "none", 
                }
            });

            (<needsvm>this.needsView.model).setup(item);
            (<centervm>this.centerView.model).setup(item);
            (<locationvm>this.locationView.model).setup(item);

            // select the Needs button in the toolbar if there isn't anything selected
            var tabtoolbar = $("#tabtoolbar").data("kendoToolBar");
			var selected = tabtoolbar.getSelectedFromGroup("tab");
			if (selected.length === 0) {
				tabtoolbar.toggle("#needs", true);
				this.layout.showIn("#viewConent", this.needsView);				
			}
            this.set("toolbarVisible", true);
        }

		public onShowRemove(e: any): void {
            var listView = $("#centerlist").data("kendoListView");
            var elem = listView.select()[0];
			$(elem)
				.find(".confirmRemove")
				.animate({ width: "70px", height: "100%", opacity: 1.0 }, 400);
			// display: "inline", 
        }

		public onRemove(e: any): void {
            // find which item is selected
            var listView = $("#centerlist").data("kendoListView");
            var index = listView.select().index();
            var item = this.centers[index];

			this.layout.showIn("#viewConent", this.blankView);
			this.set("toolbarVisible", false);

            this.centers.remove(item);
		}

       public tabToggle(e: any) {
            //e.target jQuery The jQuery object that represents the command element.
            //e.checked Boolean Boolean flag that indicates the button state.
            //e.id String The id of the command element.
            //e.sender kendo.ui.ToolBar The widget instance which fired the event.
            //hfc.common.log("tab toggle: " + e.id + " --> " + e.checked);
            //var row = this.modules.filter(function (r) { return r.id === e.id; });
            //hfc.common.log("data: " + JSON.stringify(row));
            switch (e.id) {
                case "needs": this.layout.showIn("#viewConent", this.needsView); break;
                case "center": this.layout.showIn("#viewConent", this.centerView); break;
                case "location": this.layout.showIn("#viewConent", this.locationView); break;
            }
        }

        public init(): void {
            this.layout.render("#tabContent");
        }

        public constructor() {
            super();
			var that = this;
            $.subscribe("loggedIn", (ref: Firebase) => {
                // register the Firebase ref
                ref.child("centers").on("value", data => {
					that.centers.length = 0;	// clear the current array
                    // join in the user's favorited centers, and add each to the collection
                    if (common.User && common.User.favorites) {
						var all = data.val();
						all.sort((a: any, b: any) => { return a.name.localeCompare(b.name); });
                        all.forEach(v => {
                            v.favorite = $.inArray(v.centerid, common.User.favorites) >= 0;
							v.onShowRemove = e => { this.onShowRemove(e); }
							v.onRemove = e => { this.onRemove(e); }
	                        that.centers.push(v);
                        });
                    }
                });
            });

			that.centers.bind("change", e => {
				if (e.action === "itemchange" && e.field === "favorite") {
					// common.log('favorite changed on the datasource!');
					// so change the user's favorites and persist
					common.User.favorites = that.centers
						.filter((v: any) => v.favorite)
						.map((v: any) => v.centerid);
					common.log("favorites are " + JSON.stringify(common.User.favorites));
					// persist the user's favorites
					$.publish("saveFavorites");
				}
			});
        }
    }
}

define([
    "text!views/manage/manage.html",
    "views/needs/needs",
    "views/center/center",
    "views/location/location"
], (template, needs, center, location) => {
    var vm = new hfc.managevm();
    vm.needsView = needs;
    vm.centerView = center;
    vm.locationView = location;

    return new kendo.View(template, {
        model: vm,
        show() { hfc.common.animate(this.element, "slideUp"); },
        init() { vm.init(); }
    });
});