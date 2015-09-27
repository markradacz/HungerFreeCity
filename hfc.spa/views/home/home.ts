/// <reference path='../../scripts/typings/jquery.d.ts' />
/// <reference path='../../scripts/typings/kendo.all.d.ts' />
/// <reference path='../../scripts/common.ts' />
module hfc {
    export class homevm extends kendo.data.ObservableObject {
        public topNeeds: string = "";
        public loggedIn: boolean = false;
        public favoritesView: kendo.View;
        public mapView: kendo.View;
        public allView: kendo.View;
        private layout = new kendo.Layout("<div id='homeViewContent'/>");

        public doLogin(e: any): void {
            $.publish("showLogin");
        }

        public doRegister(e: any): void {
            $.publish("showRegister");
        }

		public tabToggle(e: any): void {
			this.tabView(e.id);
        }

		public tabView(id: string): void {
			switch (id) {
				case "favorites": this.layout.showIn("#homeViewContent", this.favoritesView, "swap"); break;
				case "map": this.layout.showIn("#homeViewContent", this.mapView, "swap"); break;
				case "all": this.layout.showIn("#homeViewContent", this.allView, "swap"); break;
			}
		}

        public init(): void {
			//super.init();
            $.subscribe("loggedIn", () => {
				this.set("loggedIn", true);
				var toolbar = $("#homeTabToolbar").data("kendoToolBar");
				toolbar.toggle("#favorites", true);
				this.tabView("favorites");
			});
            $.subscribe("loggedOff", () => { this.set("loggedIn", false); });
			$.subscribe("topNeeds", (top: string) => { this.set("topNeeds", top); });

            this.set("loggedIn", common.User ? true : false);
            this.layout.render("#homeTabContent");
        }
    }
}

define([
    "text!/views/home/home.html",
	"/views/favorites/favorites.js",
    "/views/map/map.js",
    "/views/all/all.js"
], (template, favorites, map, all) => {
    var vm: hfc.homevm = new hfc.homevm();

	vm.favoritesView = favorites;
    vm.mapView = map;
    vm.allView = all;

    var view: kendo.View = new kendo.View(template, {
        model: vm,
        show() { hfc.common.animate(this.element); },
        init() { vm.init(); }
    });
    return view;
});