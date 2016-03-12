/// <reference path="../../scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../../scripts/typings/kendo-ui/kendo-ui.d.ts" />
/// <reference path='../../scripts/common.ts' />
module hfc {
    export class favoritesvm extends kendo.data.ObservableObject {
        public centers = new kendo.data.ObservableArray([]);

        public init(): void {
        }

		private load = () => {
			common.firebase.child("centers").on("value", data => {
				this.centers.length = 0;	// clear the current array
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
					all.forEach(c => {
						if (c.favorite) this.centers.push(c);
					});

					// compute the top-most need
					var top = [];
					all.forEach(c => {
						c.needs.forEach((n,i) => {
							var found = jQuery.grep(top, t => t.name === n.name);
							if (found.length > 0) found[0].count += 1 / (i + 1); // weighted per position
							else top.push({ name: n.name, count: 1 / (i + 1) });
						});
					});
					top.sort((a, b) => (b.count - a.count)); // descending
					var topmost = top[0];
					const allSameTopCount = jQuery.grep(top, t => t.count === topmost.count).map(t => t.name).join(", ");
					$.publish("topNeeds", [allSameTopCount]);
				}
			});
		}

		public constructor() {
            super();
			var that = this;

			$.subscribe("loggedIn", that.load);

				// re-load the centers when the favorites change
			$.subscribe("saveFavorites", that.load);

			that.centers.bind("change", e => {
				if (e.action === "itemchange" && e.field === "favorite") {
					// so change the user's favorites and persist
					common.User.favorites = that.centers
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
    "text!/views/favorites/favorites.html"
], (template) => {
    var vm = new hfc.favoritesvm();
    return new kendo.View(template, {
        model: vm,
        show() { hfc.common.animate(this.element); },
        init() { vm.init(); }
    });
});