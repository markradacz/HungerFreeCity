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
    var managevm = (function (_super) {
        __extends(managevm, _super);
        function managevm() {
            _super.call(this);
            this.title = "Manage";
            this.toolbarVisible = false;
            this.blankView = new kendo.View("<div/>");
            this.centers = new kendo.data.ObservableArray([]);
            this.layout = new kendo.Layout("<div id='viewConent'/>");
            var that = this;
            $.subscribe("loggedIn", function (ref) {
                // register the Firebase ref
                ref.child("centers").on("value", function (data) {
                    that.centers.length = 0; // clear the current array
                    // join in the user's favorited centers, and add each to the collection
                    if (hfc.common.User && hfc.common.User.favorites) {
                        var all = data.val();
                        all.sort(function (a, b) { return a.name.localeCompare(b.name); });
                        all.forEach(function (v) {
                            v.favorite = $.inArray(v.centerid, hfc.common.User.favorites) >= 0;
                            that.centers.push(v);
                        });
                    }
                });
            });
            that.centers.bind("change", function (e) {
                if (e.action === "itemchange" && e.field === "favorite") {
                    // common.log('favorite changed on the datasource!');
                    // so change the user's favorites and persist
                    hfc.common.User.favorites = that.centers
                        .filter(function (v) { return v.favorite; })
                        .map(function (v) { return v.centerid; });
                    hfc.common.log("favorites are " + JSON.stringify(hfc.common.User.favorites));
                    // persist the user's favorites
                    $.publish("saveFavorites");
                }
            });
        }
        managevm.prototype.doAction = function (e) {
            var listView = $("#centerlist").data("kendoListView");
            if (e.id === "addcenter") {
                var center = {
                    name: "  New Center",
                    centerid: kendo.guid(),
                    address: {},
                    needs: [],
                    centerinfo: [],
                    geometry: {
                        coordinates: []
                    }
                };
                this.centers.unshift(center);
                this.showButtons(false);
            }
            else if (e.id === "removecenter") {
                // find which item is selected
                var index = listView.select().index();
                var item = this.centers[index];
                this.layout.showIn("#viewConent", this.blankView);
                this.set("toolbarVisible", false);
                this.centers.remove(item);
                this.showButtons(false);
            }
        };
        managevm.prototype.showButtons = function (fadein) {
            if (fadein) {
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
            var item = this.centers[index];
            this.needsView.model.setup(item);
            this.centerView.model.setup(item);
            this.locationView.model.setup(item);
            this.layout.showIn("#viewConent", this.needsView);
            // select the Needs button in the toolbar
            var tabtoolbar = $("#tabtoolbar").data("kendoToolBar");
            tabtoolbar.toggle("#needs", true); //select button with id: "foo"
            this.set("toolbarVisible", true);
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
            this.layout.render("#tabContent");
        };
        return managevm;
    })(kendo.data.ObservableObject);
    hfc.managevm = managevm;
})(hfc || (hfc = {}));
define([
    "text!views/manage/manage.html",
    "views/manage/needs",
    "views/manage/center",
    "views/manage/location"
], function (template, needs, center, location) {
    var vm = new hfc.managevm();
    vm.needsView = needs;
    vm.centerView = center;
    vm.locationView = location;
    return new kendo.View(template, {
        model: vm,
        show: function () { hfc.common.animate(this.element, "slideUp"); },
        init: function () { vm.init(); }
    });
});
//# sourceMappingURL=manage.js.map