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
            _super.apply(this, arguments);
            this.title = "Manage";
            this.toolbarVisible = false;
            this.centers = new kendo.data.DataSource({
                type: "firebase",
                autoSync: false,
                transport: { firebase: { url: hfc.common.FirebaseUrl + "centers" } },
                sort: [
                    //{ field: "favorite", dir: "desc" },   // Note: causes re-order when favorite clicked, but listview doesn't show the change
                    { field: "name", dir: "asc" }
                ],
                schema: {
                    parse: function (items) {
                        // join in the user's favorited centers
                        if (hfc.common.User && hfc.common.User.favorites) {
                            items.forEach(function (v) {
                                v.favorite = $.inArray(v.centerid, hfc.common.User.favorites) >= 0;
                            });
                        }
                        return items;
                    }
                },
                change: function (e) {
                    if (e.action === 'itemchange' && e.field === 'favorite') {
                        hfc.common.log('favorite changed on the datasource!');
                        // so change the user's favorites and persist
                        var all = this.data();
                        hfc.common.User.favorites = all.filter(function (v) { return v.favorite; }).map(function (v) { return v.centerid; });
                        //common.log('favorites are ' + JSON.stringify(hfc.common.User.favorites ) );
                        // persist the user's favorites
                        $.publish('saveFavorites');
                    }
                }
            });
            this.layout = new kendo.Layout("<div id='viewConent'/>");
        }
        managevm.prototype.doAction = function (e) {
            if (e.id === "addcenter") {
                this.centers.add({ name: '  New Center', address: {}, needs: [], centerinfo: [], geometry: { coordinates: [] } });
                this.showButtons(false);
            }
            else if (e.id == "removecenter") {
                // find which item is selected
                var listView = $('#centerlist').data("kendoListView");
                var index = listView.select().index();
                var item = listView.dataSource.view()[index];
                this.centers.remove(item);
                this.showButtons(false);
            }
        };
        managevm.prototype.showButtons = function (b) {
            if (b) {
                $("a#removecenter").fadeIn(300);
            }
            else {
                $("a#removecenter").fadeOut(300);
            }
        };
        managevm.prototype.showCenter = function (e) {
            // get the row of the collection to bind to the subviews
            var listView = $(e.sender.element).data("kendoListView");
            var index = listView.select().index();
            this.showButtons(index >= 0);
            var item = listView.dataSource.view()[index];
            var url = hfc.common.FirebaseUrl + "centers/" + index;
            //common.log('selected center url is ' + url);
            this.needsView.model.setup(item, url);
            this.centerView.model.setup(item, url);
            this.locationView.model.setup(item, url);
            this.layout.showIn("#viewConent", this.needsView);
            // select the Needs button in the toolbar
            var tabtoolbar = $("#tabtoolbar").data("kendoToolBar");
            tabtoolbar.toggle("#needs", true); //select button with id: "foo"
            this.set('toolbarVisible', true);
        };
        managevm.prototype.tabToggle = function (e) {
            //e.target jQuery The jQuery object that represents the command element.
            //e.checked Boolean Boolean flag that indicates the button state.
            //e.id String The id of the command element.
            //e.sender kendo.ui.ToolBar The widget instance which fired the event.
            //hfc.common.log("tab toggle: " + e.id + " --> " + e.checked);
            //var row = this.modules.filter(function (r) { return r.id === e.id; });
            //hfc.common.log("data: " + JSON.stringify(row));
            switch (e.id) {
                case "needs":
                    this.layout.showIn("#viewConent", this.needsView);
                    break;
                case "center":
                    this.layout.showIn("#viewConent", this.centerView);
                    break;
                case "location":
                    this.layout.showIn("#viewConent", this.locationView);
                    break;
            }
        };
        managevm.prototype.init = function () {
            var _this = this;
            this.layout.render('#tabContent');
            $.subscribe('loggedIn', function () {
                // re-read our datasource upon login, so favorties are matched
                _this.centers.read();
            });
            if (hfc.common.User && hfc.common.User.favorites) {
                // re-read our datasource upon login, so favorties are matched
                this.centers.read();
            }
        };
        return managevm;
    })(kendo.data.ObservableObject);
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