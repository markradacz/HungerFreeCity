var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../../scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../../scripts/typings/kendo-ui/kendo-ui.d.ts" />
/// <reference path='../../scripts/common.ts' />
var hfc;
(function (hfc) {
    var homevm = (function (_super) {
        __extends(homevm, _super);
        function homevm() {
            _super.apply(this, arguments);
            this.topNeeds = "";
            this.loggedIn = false;
            this.layout = new kendo.Layout("<div id='homeViewContent'/>");
        }
        homevm.prototype.doLogin = function (e) {
            $.publish("showLogin");
        };
        homevm.prototype.doRegister = function (e) {
            $.publish("showRegister");
        };
        homevm.prototype.tabToggle = function (e) {
            this.tabView(e.id);
        };
        homevm.prototype.tabView = function (id) {
            switch (id) {
                case "favorites":
                    this.layout.showIn("#homeViewContent", this.favoritesView, "swap");
                    break;
                case "map":
                    this.layout.showIn("#homeViewContent", this.mapView, "swap");
                    break;
                case "all":
                    this.layout.showIn("#homeViewContent", this.allView, "swap");
                    break;
            }
        };
        homevm.prototype.init = function () {
            var _this = this;
            //super.init();
            $.subscribe("loggedIn", function () {
                _this.set("loggedIn", true);
                var toolbar = $("#homeTabToolbar").data("kendoToolBar");
                toolbar.toggle("#favorites", true);
                _this.tabView("favorites");
            });
            $.subscribe("loggedOff", function () { _this.set("loggedIn", false); });
            $.subscribe("topNeeds", function (top) { _this.set("topNeeds", top); });
            this.set("loggedIn", hfc.common.User ? true : false);
            this.layout.render("#homeTabContent");
        };
        return homevm;
    })(kendo.data.ObservableObject);
    hfc.homevm = homevm;
})(hfc || (hfc = {}));
define([
    "text!/views/home/home.html",
    "/views/favorites/favorites.js",
    "/views/map/map.js",
    "/views/all/all.js"
], function (template, favorites, map, all) {
    var vm = new hfc.homevm();
    vm.favoritesView = favorites;
    vm.mapView = map;
    vm.allView = all;
    return new kendo.View(template, {
        model: vm,
        show: function () { hfc.common.animate(this.element); },
        init: function () { vm.init(); }
    });
});
//# sourceMappingURL=home.js.map