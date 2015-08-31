var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var _this = this;
/// <reference path="../../scripts/typings/require.d.ts" />
/// <reference path="../../scripts/typings/jquery.d.ts" />
/// <reference path="../../scripts/typings/kendo.all.d.ts" />
/// <reference path="../../scripts/common.ts" />
var hfc;
(function (hfc) {
    var needsvm = (function (_super) {
        __extends(needsvm, _super);
        function needsvm() {
            _super.apply(this, arguments);
            this.title = "Needs";
        }
        needsvm.prototype.setup = function (item, url) {
            this.set("item", item);
            this.set("url", url);
        };
        needsvm.prototype.onDataBound = function () {
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
        };
        needsvm.prototype.init = function () {
        };
        return needsvm;
    })(hfc.BaseViewModel);
    hfc.needsvm = needsvm;
})(hfc || (hfc = {}));
define([
    'text!views/manage/needs.html',
    'kendo'
], function (template) {
    var vm = new hfc.needsvm();
    var view = new kendo.View(template, {
        model: vm,
        show: function (e) { kendo.fx(_this.element).fade('in').duration(500).play(); },
        init: function () { vm.init(); }
    });
    return view;
});
//# sourceMappingURL=needs.js.map