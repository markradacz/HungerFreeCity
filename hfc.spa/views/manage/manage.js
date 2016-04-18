var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../../scripts/typings/require.d.ts" />
/// <reference path="../../scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../../scripts/typings/kendo-ui/kendo-ui.d.ts" />
/// <reference path="../../scripts/common.ts" />
var hfc;
(function (hfc) {
    var managevm = (function (_super) {
        __extends(managevm, _super);
        function managevm() {
            var _this = this;
            _super.call(this);
            this.toolbarVisible = false;
            this.isAdmin = false;
            this.blankView = new kendo.View("<div/>");
            this.centers = new kendo.data.ObservableArray([]);
            this.item = { name: "" };
            this.layout = new kendo.Layout("<div id='viewContent'/>");
            var that = this;
            $.subscribe("loggedIn", function () {
                var isadmin = hfc.common.hasRole("admin");
                _this.set("isAdmin", isadmin);
                hfc.common.firebase.child("centers").on("value", function (data) {
                    that.centers.length = 0; // clear the current array
                    // join in the user's centers, and add each to the collection
                    if (hfc.common.User) {
                        var key = data.key();
                        var all = [];
                        // convert object to an array
                        data.forEach(function (v) {
                            var c = v.val();
                            c.refkey = key + "/" + v.key();
                            c.canEdit = isadmin || $.inArray(c.centerid, hfc.common.User.centers) >= 0;
                            if (!c.needs)
                                c.needs = [];
                            if (!c.centertype)
                                c.centertype = hfc.common.CenterTypes[0].id;
                            c.onShowRemove = function (e) { _this.onShowRemove(e); };
                            c.onRemove = function (e) { _this.onRemove(e); };
                            c.isAdmin = _this.get("isAdmin");
                            all.push(c);
                        });
                        all.sort(function (a, b) {
                            return a.name.localeCompare(b.name);
                        });
                        all.forEach(function (v) {
                            if (v.canEdit)
                                that.centers.push(v);
                        });
                    }
                });
            });
        }
        managevm.prototype.doAction = function (e) {
            if (e.id === "addcenter") {
                if (!this.get("isAdmin")) {
                    hfc.common.errorToast("Insufficient privilege to create a center. Must be an Admin.");
                    return;
                }
                var center = {
                    name: " New Center",
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
                    centerid: kendo.guid(),
                    centertype: hfc.common.CenterTypes[0].id
                };
                // first, add the new center to this user's authorized centers
                var user = hfc.common.User;
                var centers = user.centers;
                centers.push(center.centerid);
                hfc.common.firebase
                    .child("users")
                    .child(user.userId)
                    .child("centers")
                    .set(centers, function (error) {
                    if (error) {
                        hfc.common.errorToast("Error saving: " + error);
                    }
                });
                // save the new center to Firebase
                this.set("item", center);
                hfc.common.firebase
                    .child("centers")
                    .push(center, function (error) {
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
            this.needsView.model.setup(item, this.centers);
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
        };
        managevm.prototype.onRemove = function (e) {
            // find which item is selected
            var listView = $("#centerlist").data("kendoListView");
            var index = listView.select().index();
            var item = this.centers[index];
            this.layout.showIn("#viewContent", this.blankView, "swap");
            this.set("toolbarVisible", false);
            // remove on Firebase (and it will remove from centers list by callback)
            hfc.common.firebase
                .child(item.refkey)
                .set(null); // remove the item
        };
        managevm.prototype.tabToggle = function (e) {
            this.tabView(e.id);
        };
        managevm.prototype.tabView = function (id) {
            switch (id) {
                case "needs":
                    this.layout.showIn("#viewContent", this.needsView, "swap");
                    break;
                case "center":
                    this.layout.showIn("#viewContent", this.centerView, "swap");
                    break;
                case "location":
                    this.layout.showIn("#viewContent", this.locationView);
                    break;
            }
        };
        managevm.prototype.listBound = function (e) {
            // called for each row bound!
            // if we have an item selected, then re-select it after a data refresh
            var curr = this.get("item");
            if (!curr)
                return;
            var listView = $("#centerlist").data("kendoListView");
            if (!listView)
                return;
            var all = listView.dataItems();
            var idx = $.indexByPropertyValue(all, "centerid", curr.centerid);
            if (idx >= 0) {
                var sel = listView.element.children()[idx];
                listView.select(sel);
            }
        };
        managevm.prototype.init = function () {
            //super.init();
            this.layout.render("#tabContent");
        };
        return managevm;
    }(kendo.data.ObservableObject));
    hfc.managevm = managevm;
})(hfc || (hfc = {}));
define([
    "text!/views/manage/manage.html",
    "/views/needs/needs.js",
    "/views/center/center.js",
    "/views/location/location.js"
], function (template, needs, center, location) {
    var vm = new hfc.managevm();
    vm.needsView = needs;
    vm.centerView = center;
    vm.locationView = location;
    return new kendo.View(template, {
        model: vm,
        show: function () { hfc.common.animate(this.element); },
        init: function () { vm.init(); }
    });
});
//# sourceMappingURL=manage.js.map