var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
            this.need = null;
        }
        needsvm.prototype.setup = function (item, refpath) {
            needsvm.instance = this;
            this.set("item", item);
            this.set("refpath", refpath);
            this.reorderItems();
        };
        needsvm.prototype.doAction = function (e) {
            var _this = this;
            if (e.id === "add") {
                // popup a dialog box to edit the value
                this.set("need", {
                    name: "New Item",
                    onShowRemove: function (e) { _this.onShowRemove(e); },
                    onRemove: function (e) { _this.onRemove(e); }
                });
                $("#editNeedPanel").data("kendoWindow").open().center();
            }
        };
        needsvm.prototype.onEdit = function (e) {
            // popup a dialog box to edit the value
            var listView = $("#needsList").data("kendoListView");
            var index = listView.select().index();
            this.set("need", this.item.needs[index]);
            $("#editNeedPanel").data("kendoWindow").open().center();
        };
        needsvm.prototype.onShowRemove = function (e) {
            var listView = $("#needsList").data("kendoListView");
            var elem = listView.select()[0];
            $(elem)
                .find("button.confirmRemove")
                .animate({ display: "inline", width: "70px", opacity: 1.0 }, 400);
        };
        needsvm.prototype.onRemove = function (e) {
            // find which item is selected
            var listView = $("#needsList").data("kendoListView");
            var index = listView.select().index();
            var item = this.item.needs[index];
            this.item.needs.remove(item);
            this.reorderItems();
        };
        needsvm.prototype.onItemSelected = function (e) {
            //var listView = $('#needsList').data("kendoListView");
            //var index = listView.select().index();
            //var item = listView.dataSource.view()[index];
            $(".needItem button.confirmRemove").each(function () {
                var op = $(this).css("opacity");
                if (op > "0") {
                    $(this).animate({ display: "none", width: "0px", opacity: 0 }, 200);
                }
            });
        };
        needsvm.prototype.reorderItems = function () {
            var _this = this;
            // reset the index values
            var needs = needsvm.instance.get("item").get("needs");
            var index = 0;
            needs.forEach(function (v) {
                v.set("index", ++index);
                v.onShowRemove = function (e) { _this.onShowRemove(e); };
                v.onRemove = function (e) { _this.onRemove(e); };
            });
        };
        needsvm.prototype.onDataBound = function () {
            // make the listview sortable and all the items within draggable
            $("#needsList").kendoSortable({
                filter: ">div.needItem",
                //cursor: "move",
                placeholder: function (element) {
                    return element.clone().css("opacity", 0.5);
                },
                hint: function (element) {
                    return element.clone().removeClass("k-state-selected");
                },
                change: function (e) {
                    var oldIndex = e.oldIndex, newIndex = e.newIndex, needs = needsvm.instance.get("item").get("needs"), need = needs[oldIndex];
                    needs.remove(need);
                    needs.splice(newIndex, 0, need); // insert at new index
                    needsvm.instance.reorderItems();
                }
            });
        };
        needsvm.prototype.saveButtonClick = function (e) {
            var needs = this.get("item").get("needs");
            needs.unshift(this.get("need"));
            this.reorderItems();
            $("#editNeedPanel").data("kendoWindow").close();
        };
        needsvm.prototype.init = function () {
        };
        needsvm.instance = null; // set in the setup() method below
        return needsvm;
    })(kendo.data.ObservableObject);
    hfc.needsvm = needsvm;
})(hfc || (hfc = {}));
define([
    "text!views/needs/needs.html",
    "kendo"
], function (template) {
    var vm = new hfc.needsvm();
    var view = new kendo.View(template, {
        model: vm,
        show: function () { hfc.common.animate(this.element); },
        init: function () { vm.init(); }
    });
    return view;
});
//# sourceMappingURL=needs.js.map