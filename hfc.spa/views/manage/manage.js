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
            var _this = this;
            _super.call(this);
            this.toolbarVisible = false;
            this.blankView = new kendo.View("<div/>");
            this.centers = new kendo.data.ObservableArray([]);
            this.item = { name: "" };
            this.layout = new kendo.Layout("<div id='viewConent'/>");
            var that = this;
            $.subscribe("loggedIn", function (ref) {
                ref.child("centers").on("value", function (data) {
                    that.centers.length = 0; // clear the current array
                    // join in the user's favorited centers, and add each to the collection
                    if (hfc.common.User && hfc.common.User.favorites) {
                        var key = data.key();
                        var all = [];
                        // convert object to an array
                        data.forEach(function (v) {
                            var c = v.val();
                            c.refkey = key + "/" + v.key();
                            c.favorite = $.inArray(c.centerid, hfc.common.User.favorites) >= 0;
                            if (!c.needs)
                                c.needs = [];
                            c.onShowRemove = function (e) { _this.onShowRemove(e); };
                            c.onRemove = function (e) { _this.onRemove(e); };
                            all.push(c);
                        });
                        all.sort(function (a, b) {
                            if (a.favorite === b.favorite)
                                return a.name.localeCompare(b.name);
                            return a.favorite ? -1 : 1;
                        });
                        all.forEach(function (v) { that.centers.push(v); });
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
            if (e.id === "addcenter") {
                var center = {
                    name: "New Center",
                    hours: "",
                    phone: "",
                    site: "",
                    address: {},
                    needs: [],
                    centerinfo: [],
                    geometry: {
                        coordinates: [-81.7276643, 30.2890513],
                        type: "Point"
                    },
                    lastModified: new Date().toISOString(),
                    centerid: kendo.guid()
                };
                // save the new center to Firebase
                this.set("item", center);
                new Firebase(hfc.common.FirebaseUrl).child("centers").push(center, function (error) {
                    if (error) {
                        hfc.common.errorToast("Error saving: " + error);
                    }
                });
            }
        };
        managevm.prototype.showCenter = function (e) {
            // get the row of the collection to bind to the subviews
            var listView = $(e.sender.element).data("kendoListView");
            var index = listView.select().index();
            var item = this.centers[index];
            this.set("item", item);
            $("#centerlist button.confirmRemove").each(function () {
                var op = $(this).css("opacity");
                if (op > "0") {
                    $(this).animate({ width: 0, height: "100%", opacity: 0 }, 200);
                }
            });
            this.needsView.model.setup(item);
            this.centerView.model.setup(item);
            this.locationView.model.setup(item);
            // select the Needs button in the toolbar if there isn't anything selected
            var tabtoolbar = $("#tabtoolbar").data("kendoToolBar");
            var selected = tabtoolbar.getSelectedFromGroup("tab");
            if (selected.length === 0) {
                tabtoolbar.toggle("#needs", true);
                this.tabView("needs");
            }
            else {
                this.tabView(selected.attr("id"));
            }
            this.set("toolbarVisible", true);
        };
        managevm.prototype.onShowRemove = function (e) {
            var listView = $("#centerlist").data("kendoListView");
            var elem = listView.select()[0];
            $(elem)
                .find(".confirmRemove")
                .animate({ width: "70px", height: "100%", opacity: 1.0 }, 400);
            // display: "inline", 
        };
        managevm.prototype.onRemove = function (e) {
            // find which item is selected
            var listView = $("#centerlist").data("kendoListView");
            var index = listView.select().index();
            var item = this.centers[index];
            this.layout.showIn("#viewConent", this.blankView, "swap");
            this.set("toolbarVisible", false);
            // remove on Firebase (and it may remove from centers list by callback)
            new Firebase(hfc.common.FirebaseUrl).child(item.refkey).set(null); // remove the item
            // this.centers.remove(item);
        };
        managevm.prototype.tabToggle = function (e) {
            //e.target jQuery The jQuery object that represents the command element.
            //e.checked Boolean Boolean flag that indicates the button state.
            //e.id String The id of the command element.
            //e.sender kendo.ui.ToolBar The widget instance which fired the event.
            //hfc.common.log("tab toggle: " + e.id + " --> " + e.checked);
            //var row = this.modules.filter(function (r) { return r.id === e.id; });
            //hfc.common.log("data: " + JSON.stringify(row));
            this.tabView(e.id);
        };
        managevm.prototype.tabView = function (id) {
            //e.target jQuery The jQuery object that represents the command element.
            //e.checked Boolean Boolean flag that indicates the button state.
            //e.id String The id of the command element.
            //e.sender kendo.ui.ToolBar The widget instance which fired the event.
            //hfc.common.log("tab toggle: " + e.id + " --> " + e.checked);
            //var row = this.modules.filter(function (r) { return r.id === e.id; });
            //hfc.common.log("data: " + JSON.stringify(row));
            switch (id) {
                case "needs":
                    this.layout.showIn("#viewConent", this.needsView, "swap");
                    break;
                case "center":
                    this.layout.showIn("#viewConent", this.centerView, "swap");
                    break;
                case "location":
                    this.layout.showIn("#viewConent", this.locationView, "swap");
                    break;
            }
        };
        managevm.prototype.listBound = function (e) {
            // called for each row bound!
            // if we have an item selected, then re-select it after a data refresh
            var curr = this.get("item");
            var listView = $("#centerlist").data("kendoListView");
            var all = listView.dataItems();
            var idx = $.indexByPropertyValue(all, "centerid", curr.centerid);
            if (idx >= 0) {
                var sel = listView.element.children()[idx];
                listView.select(sel);
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
    "views/needs/needs",
    "views/center/center",
    "views/location/location"
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