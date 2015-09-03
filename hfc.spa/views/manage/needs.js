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
            this.need = null;
            this.needs = new kendo.data.DataSource({
                type: "firebase",
                autoSync: false,
                transport: { firebase: { url: hfc.common.FirebaseUrl } },
                schema: {
                    parse: function (items) {
                        // add an index
                        var index = 0;
                        items.forEach(function (v) {
                            v.index = ++index;
                            v.onRemove = function (e) { hfc.common.log("onRemove"); };
                            v.onShowRemove = function (e) { hfc.common.log("onShowRemove"); };
                            v.onEdit = function (e) { hfc.common.log("onEdit"); };
                        });
                        return items;
                    }
                }
            });
        }
        needsvm.prototype.setup = function (item, url) {
            this.set("item", item);
            this.set("url", url);
            var needs = this.get('needs');
            var options = needs.options.transport;
            options.firebase.url = url + '/needs';
            needs.transport.init(options);
            needs.read();
        };
        needsvm.prototype.doAction = function (e) {
            if (e.id === "add") {
                // popup a dialog box to edit the value
                var listView = $('#needsList').data("kendoListView");
                this.item.needs.unshift({ name: 'New Item' });
                listView.select(listView.element.children().first());
                this.set('need', listView.dataSource.view()[0]);
                $('#editNeedPanel').data('kendoWindow').open().center();
            }
        };
        needsvm.prototype.onEdit = function (e) {
            // popup a dialog box to edit the value
            var listView = $('#needsList').data("kendoListView");
            var index = listView.select().index();
            this.set('need', listView.dataSource.view()[index]);
            $('#editNeedPanel').data('kendoWindow').open().center();
        };
        needsvm.prototype.onShowRemove = function (e) {
            var listView = $('#needsList').data("kendoListView");
            var elem = listView.select()[0];
            $(elem).find('a.confirmRemove').animate({ display: 'inline', width: '70px', opacity: 1.0 }, 400);
        };
        needsvm.prototype.onRemove = function (e) {
            // find which item is selected
            var listView = $('#needsList').data("kendoListView");
            var index = listView.select().index();
            var item = listView.dataSource.view()[index];
            this.item.needs.remove(item);
        };
        needsvm.prototype.onItemSelected = function (e) {
            //var listView = $('#needsList').data("kendoListView");
            //var index = listView.select().index();
            // var item = listView.dataSource.view()[index];
            $("#needsList a.confirmRemove").each(function (index) {
                var op = $(this).css('opacity');
                if (op > '0') {
                    $(this).animate({ display: 'none', width: '1px', opacity: 0 }, 200);
                }
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
                    var oldIndex = e.oldIndex, newIndex = e.newIndex, listView = $('#needsList').data("kendoListView"), data = listView.dataSource.view(), item = data[oldIndex];
                    // data.remove(item);
                    data.splice(oldIndex, 1); // remove at old index
                    data.splice(newIndex, 0, item); // insert at new index
                }
            });
        };
        needsvm.prototype.closeButtonClick = function (e) {
            $('#editNeedPanel').data('kendoWindow').close();
        };
        needsvm.prototype.init = function () {
        };
        return needsvm;
    })(kendo.data.ObservableObject);
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