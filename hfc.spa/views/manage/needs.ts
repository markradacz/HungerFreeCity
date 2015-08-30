/// <reference path="../../scripts/typings/require.d.ts" />
/// <reference path="../../scripts/typings/jquery.d.ts" />
/// <reference path="../../scripts/typings/kendo.all.d.ts" />
/// <reference path="../../scripts/common.ts" />
module hfc {
    export class needsvm extends BaseViewModel {
        public title: string = "Needs";
        public item: any;  // defined by the manage viewmodel
        public OnDataBound() {
            // make the listview sortable and all the items within draggable
            $("#needsList").kendoSortable({
                filter: ">div.needItem",
                cursor: "move",
                placeholder: function (element) {
                    return element.clone().css("opacity", 0.1);
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

        public init(): void {
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