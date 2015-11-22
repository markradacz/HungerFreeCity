/// <reference path="../../scripts/typings/require.d.ts" />
/// <reference path="../../scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../../scripts/typings/kendo-ui/kendo-ui.d.ts" />
/// <reference path="../../scripts/common.ts" />
module hfc {
    export class centervm extends kendo.data.ObservableObject {
        public item: any;
		public canEdit = false;
		public CenterTypes = hfc.common.CenterTypes;

		public doAction(e: any): void {
            if (e.id === "edit") {
				this.set("canEdit", true);
			} else if (e.id === "save") {
				// Save the record
				const item = this.get("item");
				const clone = JSON.parse(JSON.stringify(item));	// cheap way to get a deep clone
				delete clone.favorite;	// remove this property
				delete clone.refkey;	// remove this property
				clone.lastModified = new Date().toISOString();

				// common.log("saving center data " + JSON.stringify(clone));
				common.firebase
					.child(item.refkey)
					.update(clone, error => {
						if (error) {
							common.errorToast("Data could not be saved." + error);
						} else {
							common.successToast("Center saved successfully.");
							this.set("canEdit", false);
						}
					});
			}
		}

        public setup(item): void {
            this.set("item", item);
        }

        public init(): void {
			//super.init();
        }
    }
}

define([
    'text!/views/center/center.html'
], template => {
    var vm = new hfc.centervm();
    return new kendo.View(template, {
        model: vm,
        show() { hfc.common.animate(this.element); },
        init() { vm.init(); }
    });
});