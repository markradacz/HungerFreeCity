/// <reference path="../../scripts/typings/require.d.ts" />
/// <reference path="../../scripts/typings/jquery.d.ts" />
/// <reference path="../../scripts/typings/kendo.all.d.ts" />
/// <reference path="../../scripts/common.ts" />
module hfc {
    export class centervm extends kendo.data.ObservableObject {
        public item: any;
        public refpath: string;

		public doAction(e: any): void {
            if (e.id === "edit") {
                // popup a dialog box to edit the value
                $("#editCenterPanel").data("kendoWindow").open().center();
			}
        }

		private closeButtonClick(e: any): void {
			// Save the record
			var clone = JSON.parse(JSON.stringify(this.get("item")));	// cheap way to get a deep clone
			delete clone.favorite;	// remove this property
			clone.lastModified = new Date().toISOString();

			// common.log("saving center data " + JSON.stringify(clone));
			var ref = new Firebase(common.FirebaseUrl);
			ref.child(this.get("refpath")).update(clone, error => {
				if (error) {
					common.errorToast("Data could not be saved." + error);
				} else {
					common.successToast("Center saved successfully.");
					$("#editCenterPanel").data("kendoWindow").close();
				}
			});
        }

        public setup(item, refpath): void {
            this.set("item", item);
			this.set("refpath", refpath);
        }

        public init(): void {
        }
    }
}

define([
    'text!views/center/center.html'
], template => {
    var vm = new hfc.centervm();
    var view = new kendo.View(template, {
        model: vm,
        show() { hfc.common.animate(this.element); },
        init() { vm.init(); }
    });
    return view;
});