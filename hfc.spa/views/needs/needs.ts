/// <reference path="../../scripts/typings/require.d.ts" />
/// <reference path="../../scripts/typings/jquery.d.ts" />
/// <reference path="../../scripts/typings/kendo.all.d.ts" />
/// <reference path="../../scripts/common.ts" />
module hfc {
    export class needsvm extends kendo.data.ObservableObject {
        public static instance: needsvm = null; // set in the setup() method below
        public title = "Needs";
        public need: any = null;
        public item: any;  // defined by the manage viewmodel
 
        public setup(item): void {
            needsvm.instance = this;
			this.set("item", item);
			this.reorderItems();
        }

        public doAction(e: any): void {
            if (e.id === "add") {
                // popup a dialog box to edit the value
                var listView = $("#needsList").data("kendoListView");
                //needs.insert(0, { name: 'New Item' });
                this.item.needs.unshift({
					name: "New Item",
					onShowRemove: e => { this.onShowRemove(e); },
					onRemove: e => { this.onRemove(e); }
                });
                listView.select(listView.element.children().first());
				this.set("need", this.item.needs[0]);
                $("#editNeedPanel").data("kendoWindow").open().center();
				this.reorderItems();
			}
        }

        public onEdit(e: any): void {
            // popup a dialog box to edit the value
            var listView = $("#needsList").data("kendoListView");
            var index = listView.select().index();
            this.set("need", this.item.needs[index]);
            $("#editNeedPanel").data("kendoWindow").open().center();
        }

        public onShowRemove(e: any): void {
            var listView = $("#needsList").data("kendoListView");
            var elem = listView.select()[0];
            $(elem)
				.find("button.confirmRemove")
				.animate({ display: "inline", width: "70px", opacity: 1.0 }, 400); 
        }

        public onRemove(e: any): void {
            // find which item is selected
            var listView = $("#needsList").data("kendoListView");
            var index = listView.select().index();
            var item = this.item.needs[index];
            this.item.needs.remove(item);
			this.reorderItems();
       }

        public onItemSelected(e: any): void {
            //var listView = $('#needsList').data("kendoListView");
            //var index = listView.select().index();
            //var item = listView.dataSource.view()[index];
            $(".needItem button.confirmRemove").each(function () {
                var op = $(this).css("opacity");
                if (op > "0") {
                    $(this).animate({ display: "none", width: "0px", opacity: 0 }, 200);
                }
            });
        }

		private reorderItems() {
			// reset the index values
			var needs = needsvm.instance.get("item").get("needs");
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
                    var oldIndex = e.oldIndex,
                        newIndex = e.newIndex,
                        needs = needsvm.instance.get("item").get("needs"),
                        need = needs[oldIndex];
                    needs.remove(need);
                    needs.splice(newIndex, 0, need); // insert at new index
					needsvm.instance.reorderItems();
                }
            });
        }

        private closeButtonClick(e: any): void {
            $("#editNeedPanel").data("kendoWindow").close();
        }

        public init(): void {
        }
    }
}

define([
    "text!views/needs/needs.html",
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