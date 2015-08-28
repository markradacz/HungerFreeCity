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
    var managevm = (function (_super) {
        __extends(managevm, _super);
        function managevm() {
            var _this = this;
            _super.apply(this, arguments);
            this.title = "Manage";
            this.centers = new kendo.data.DataSource({
                type: "firebase",
                autoSync: false,
                transport: { firebase: { url: 'https://amber-torch-2255.firebaseio.com/' } }
            });
            this.showCenter = function (e) {
                // hfc.common.log("showCenter");
                // get the row of the collection to bind to the subviews
                var listView = $(e.sender.element).data("kendoListView");
                var index = listView.select().index();
                var item = listView.dataSource.view()[index];
                //hfc.common.log(JSON.stringify(item));
                _this.needsView.model.set('item', item);
                _this.centerView.model.set('item', item);
                _this.locationView.model.set('item', item);
                _this.layout.showIn("#viewConent", _this.needsView);
                // select the Needs button in the toolbar
                var tabtoolbar = $("#tabtoolbar").data("kendoToolBar");
                tabtoolbar.toggle("#needs", true); //select button with id: "foo"
            };
            this.tabToggle = function (e) {
                //e.target jQuery The jQuery object that represents the command element.
                //e.checked Boolean Boolean flag that indicates the button state.
                //e.id String The id of the command element.
                //e.sender kendo.ui.ToolBar The widget instance which fired the event.
                //hfc.common.log("tab toggle: " + e.id + " --> " + e.checked);
                //var row = this.modules.filter(function (r) { return r.id === e.id; });
                //hfc.common.log("data: " + JSON.stringify(row));
                switch (e.id) {
                    case "needs":
                        _this.layout.showIn("#viewConent", _this.needsView);
                        break;
                    case "center":
                        _this.layout.showIn("#viewConent", _this.centerView);
                        break;
                    case "location":
                        _this.layout.showIn("#viewConent", _this.locationView);
                        break;
                }
            };
            this.layout = new kendo.Layout("<div id='viewConent'/>");
        }
        managevm.prototype.init = function () {
            this.layout.render('#tabContent');
        };
        return managevm;
    })(hfc.BaseViewModel);
    hfc.managevm = managevm;
})(hfc || (hfc = {}));
define([
    'text!views/manage/manage.html',
    'views/manage/needs',
    'views/manage/center',
    'views/manage/location'
], function (template, needs, center, location) {
    var vm = new hfc.managevm();
    vm.needsView = needs;
    vm.centerView = center;
    vm.locationView = location;
    return new kendo.View(template, {
        model: vm,
        show: function (e) { kendo.fx(_this.element).fade('in').duration(500).play(); },
        init: function () { vm.init(); }
    });
});
//# sourceMappingURL=manage.js.map