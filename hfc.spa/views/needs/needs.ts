/// <reference path="../../scripts/typings/require.d.ts" />
/// <reference path="../../scripts/typings/jquery.d.ts" />
/// <reference path="../../scripts/typings/kendo.all.d.ts" />
/// <reference path="../../scripts/common.ts" />
module hfc {
    export class needsvm extends kendo.data.ObservableObject {
        public static instance: needsvm = null; // set in the setup() method below
        public initialized = false; // set in the databound() method below
        public need: any = null;
        public item: any;
		public isLinked = false;
		public adding: boolean;
		public centers = new kendo.data.ObservableArray([]);
 
        public setup(item, centers): void {
            needsvm.instance = this;
			if (!item.linked) item.linked = "";
			this.set("item", item);
			this.set("centers", centers);
			this.reorderItems();
        }

        public doLinkAction(e: any): void {
			const toolbar = $("#centerLinkToolbar").data("kendoToolBar");
			if (e.id === "yes") {
				this.set("isLinked", true);
				toolbar.show($("#dropDownSegment"));
			}
			if (e.id === "no") {
				this.set("isLinked", false);
				// TODO: get the List from the last linked center into this center
				this.item.linked = "";
				toolbar.hide($("#dropDownSegment"));
				this.updateCenter();
			}
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
			this.saveCenterNeeds(item);

			// find linked centers and update their needs too
			this.centers.forEach((c: any) => {
				if (c.linked === item.centerid) {
					c.needs = item.needs;
					// save the center's needs
					this.saveCenterNeeds(c);
				}
			});
		}

		private saveCenterNeeds(centerItem): void {
			const clone = JSON.parse(JSON.stringify(centerItem.needs));	// cheap way to get a deep clone
			var ref = new Firebase(common.FirebaseUrl).child(centerItem.refkey);
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

			// TODO: prevent linking for centers that are themselves referenced as links

			const toolbar = $("#centerLinkToolbar").data("kendoToolBar");
			if (!toolbar) return;

			const init = this.get("initialized");
			if (!init) {
				// only do this once
				toolbar.add({ template: "<input id='centerDropdown'/>", id: "dropDownSegment" });
				this.set("initialized", true);
			}

			const item = this.get("item");
	        $("#centerDropdown").kendoDropDownList({
		        optionLabel: "Linked Center",
		        dataTextField: "name",
				dataValueField: "centerid",
				valuePrimitive: false,
				dataSource: this.centers.filter((c: any) => {
					return c.centerid !== item.centerid && !c.linked;
				}),
				value: item.linked,
				select: e => {
					// Use the selected item or its text
					var chosenlink: any = e.sender.dataItem(e.item);
					var item = this.get("item");
					if (item.linked !== chosenlink.centerid) {
						item.linked = chosenlink.centerid;
						// TODO: get the List from the linked center into this center
						// update the item
						this.updateCenter();
					}
				}
			});

			if (item.linked !== "") {
				this.set("isLinked", true);
				toolbar.toggle("#yes", true);
				toolbar.show($("#dropDownSegment"));	
			} else {
				this.set("isLinked", false);
				toolbar.toggle("#no", true);			
				toolbar.hide($("#dropDownSegment"));
			}
        }

		private updateCenter(): void {
			const item = this.get("item");
			const clone = JSON.parse(JSON.stringify(item));	// cheap way to get a deep clone
			delete clone.favorite;	// remove this property
			delete clone.refkey;	// remove this property
			clone.lastModified = new Date().toISOString();
			const ref = new Firebase(common.FirebaseUrl).child(item.refkey);
			ref.update(clone, error => {
				if (error) {
					common.errorToast("Center data could not be updated." + error);
				} else {
					common.successToast("Center data updated successfully.");
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