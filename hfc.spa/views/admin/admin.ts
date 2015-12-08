/// <reference path="../../scripts/typings/require.d.ts" />
/// <reference path="../../scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../../scripts/typings/kendo-ui/kendo-ui.d.ts" />
/// <reference path="../../scripts/common.ts" />
module hfc {
    export class adminvm extends kendo.data.ObservableObject {
        public usersView: kendo.View;
        public blankView = new kendo.View("<div/>");

        private layout = new kendo.Layout("<div id='adminConent'/>");

		public tabToggle(e: any): void {
			this.tabView(e.id);
        }

		public tabView(id: string): void {
			switch (id) {
				case "users": this.layout.showIn("#adminConent", this.usersView, "swap"); break;
			}
		}

        public init(): void {
            this.layout.render("#adminTabs");
        }

        public constructor() {
            super();
        }
    }
}

define([
    "text!/views/admin/admin.html",
    "/views/users/users.js"
], (template, users) => {
    var vm = new hfc.adminvm();
    vm.usersView = users;

    return new kendo.View(template, {
        model: vm,
        show() { hfc.common.animate(this.element, "slideUp"); },
        init() { vm.init(); }
    });
});