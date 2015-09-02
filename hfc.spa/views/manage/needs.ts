/// <reference path="../../scripts/typings/require.d.ts" />
/// <reference path="../../scripts/typings/jquery.d.ts" />
/// <reference path="../../scripts/typings/kendo.all.d.ts" />
/// <reference path="../../scripts/common.ts" />
module hfc {
    export class needsvm extends kendo.data.ObservableObject {
        public title: string = "Needs";
        public item: any;  // defined by the manage viewmodel
        public url: string;  // defined by the manage viewmodel
        public need: any = null;

        public setup(item, url): void {
            this.set("item", item);
            this.set("url", url);
        }

        public doAction(e: any): void {
            if (e.id === "add") {
                this.item.needs.push({ name: 'New Item' });
                this.showButtons(false);
            } else if (e.id == "edit") {
                // popup a dialog box to edit the value
                var listView = $('#needsList').data("kendoListView");
                var index = listView.select().index();
                this.set('need', listView.dataSource.view()[index]);

                var p = $('#editNeedPanel').data('kendoWindow');
                p.open();
                p.center();

            } else if(e.id == "remove") {
                // find which item is selected
                var listView = $('#needsList').data("kendoListView");
                var index = listView.select().index();
                var item = listView.dataSource.view()[index];
                this.item.needs.remove(item);
                this.showButtons(false);
            }
        }

        public onItemSelected(e: any): void {
            var listView = $('#needsList').data("kendoListView");
            var index = listView.select().index();
            // var item = listView.dataSource.view()[index];
            this.showButtons((index >= 0));
        }

        public onDataBound(): void {
            // make the listview sortable and all the items within draggable
            $("#needsList").kendoSortable({
                filter: ">div.needItem",
                cursor: "move",
                placeholder: function (element) {
                    return element.clone().css("opacity", 0.5);
                },
                hint: function (element) {
                    return element.clone().removeClass("k-state-selected");
                },
                change: function (e) {
                    //var skip = dataSource.skip(),
                    //    oldIndex = e.oldIndex + skip,
                    //    newIndex = e.newIndex + skip,
                    //    data = dataSource.data(),
                    //    dataItem = dataSource.getByUid(e.item.data("uid"));
                    //dataSource.remove(dataItem);
                    //dataSource.insert(newIndex, dataItem);

                    //var srcUid = e.draggable.element.data("uid");
                    //var dstUid = e.dropTarget.data("uid");
                    //var srcItem = dataSource.getByUid(srcUid);
                    //var dstItem = dataSource.getByUid(dstUid);
                    //var dstIdx = dataSource.indexOf(dstItem);
                    //dataSource.remove(srcItem);
                    //dataSource.insert(dstIdx, srcItem);
                    //e.draggable.destroy();
                }
            });
        }

        private showButtons(b: boolean): void {
            if (b) {
                $("a#remove").fadeIn(300);
                $("a#edit").fadeIn(300);
            } else {
                $("a#remove").fadeOut(300);
                $("a#edit").fadeOut(300);
            }
        }

        public init(): void {
            this.bind("change", function (e) {
                if (e.field === 'item') {
                    this.showButtons(false);
                }
            });
        }
    }
}

define([
    'text!views/manage/needs.html',
    'kendo'
], template => {
    var vm = new hfc.needsvm();
    var view = new kendo.View(template, {
        model: vm,
        show: e => { kendo.fx(this.element).fade('in').duration(500).play(); },
        init: () => { vm.init(); }
    });
    return view;
});