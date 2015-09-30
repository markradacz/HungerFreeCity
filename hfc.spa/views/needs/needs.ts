/// <reference path="../../scripts/typings/require.d.ts" />
/// <reference path="../../scripts/typings/jquery.d.ts" />
/// <reference path="../../scripts/typings/kendo.all.d.ts" />
/// <reference path="../../scripts/common.ts" />
module hfc {
    export class needsvm extends kendo.data.ObservableObject {
        public static instance: needsvm = null; // set in the setup() method below
        public need: any = null;
        public item: any;
		public adding: boolean;
 
        public setup(item): void {
            needsvm.instance = this;
			this.set("item", item);
			this.reorderItems();
        }

        public doAction(e: any): void {
            if (e.id === "add") {
                // popup a dialog box to edit the value
				this.set("need", {
					name: "New Item",
					onShowRemove: e => { this.onShowRemove(e); },
					onRemove: e => { this.onRemove(e); }
				});
	            this.set("adding", true);
                $("#editNeedPanel").data("kendoWindow").open().center();
			}
        }

		private saveNeeds(): void {
			// common.log("saving center data " + JSON.stringify(clone));
			const item = this.get("item");
			const clone = JSON.parse(JSON.stringify(item.needs));	// cheap way to get a deep clone
			var ref = new Firebase(common.FirebaseUrl).child(item.refkey);
			ref.child("needs")
				.set(clone, error => {
					if (error) {
						common.errorToast("Needs data could not be saved." + error);
					} else {
						common.successToast("Needs data saved successfully.");
						ref.update({ lastModified: new Date().toISOString() });
					}
				});
		}

        public onEdit(e: any): void {
            // popup a dialog box to edit the value
            const listView = $("#needsList").data("kendoListView");
            const index = listView.select().index();
            this.set("need", this.item.needs[index]);
			this.set("adding", false);
            $("#editNeedPanel").data("kendoWindow").open().center();
        }

        public onShowRemove(e: any): void {
            const listView = $("#needsList").data("kendoListView");
            const elem = listView.select()[0];
            $(elem)
				.find("button.confirmRemoveNeed")
				.animate({ display: "inline", width: "70px", opacity: 1.0 }, 400); 
        }

        public onRemove(e: any): void {
            // find which item is selected
            const listView = $("#needsList").data("kendoListView");
            const index = listView.select().index();
            const item = this.item.needs[index];
            this.item.needs.remove(item);
			this.reorderItems();
	        this.saveNeeds();
        }

        public onItemSelected(e: any): void {
            //var listView = $('#needsList').data("kendoListView");
            //var index = listView.select().index();
            //var item = listView.dataSource.view()[index];
            $(".needItem button.confirmRemoveNeed").each(function () {
                const op = $(this).css("opacity");
                if (op > "0") {
                    $(this).animate({ display: "none", width: "0px", opacity: 0 }, 200);
                }
            });
        }

		private reorderItems(): void {
			// reset the index values
			const needs = needsvm.instance.get("item").get("needs");
			var index = 0;
			needs.forEach((v: any) => {
				v.set("index", ++index);
				v.onShowRemove = e => { this.onShowRemove(e); }
				v.onRemove = e => { this.onRemove(e); }
			});		
		}

        public onDataBound(): void {
            // make the listview sortable and all the items within draggable
            $("#needsList").kendoSortable({
                filter: ">div.needItem",
                //cursor: "move",
                placeholder(element) {
                    return element.clone().css("opacity", 0.5);
                },
                hint(element) {
                    return element.clone().removeClass("k-state-selected");
                },
                change(e) {
                    const oldIndex = e.oldIndex,
                        newIndex = e.newIndex,
                        needs = needsvm.instance.get("item").get("needs"),
                        need = needs[oldIndex];
                    needs.remove(need);
                    needs.splice(newIndex, 0, need); // insert at new index
					needsvm.instance.reorderItems();
					window.setTimeout(() => { needsvm.instance.saveNeeds() }, 1);	// background save
                }
            });
        }

        private saveButtonClick(e: any): void {
	        if (this.get("adding")) {
		        const needs = this.get("item").get("needs");
		        needs.unshift(this.get("need"));
		        this.reorderItems();
				this.set("adding", false);
	        }
	        $("#editNeedPanel").data("kendoWindow").close();
			this.saveNeeds();
        }

        public init(): void {
			//super.init();
        }
    }
}

define([
    "text!/views/needs/needs.html",
    "kendo"
], template => {
    var vm = new hfc.needsvm();
    var view = new kendo.View(template, {
        model: vm,
        show() { hfc.common.animate(this.element); },
        init() { vm.init(); }
    });
    return view;
});