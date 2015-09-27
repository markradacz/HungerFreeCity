var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path='../../scripts/typings/jquery.d.ts' />
/// <reference path='../../scripts/typings/kendo.all.d.ts' />
/// <reference path='../../scripts/common.ts' />
var hfc;
(function (hfc) {
    var allvm = (function (_super) {
        __extends(allvm, _super);
        function allvm() {
            _super.call(this);
            this.centers = new kendo.data.ObservableArray([]);
            var that = this;
            $.subscribe("loggedIn", function (ref) {
                ref.child("centers").on("value", function (data) {
                    that.centers.length = 0; // clear the current array
                    // join in the user's favorited centers, and add each to the collection
                    if (hfc.common.User) {
                        var all = [];
                        // convert object to an array
                        data.forEach(function (v) {
                            var c = v.val();
                            c.favorite = $.inArray(c.centerid, hfc.common.User.favorites) >= 0;
                            if (!c.needs)
                                c.needs = [];
                            all.push(c);
                        });
                        all.sort(function (a, b) {
                            if (a.favorite === b.favorite)
                                return a.name.localeCompare(b.name);
                            return a.favorite ? -1 : 1;
                        });
                        all.forEach(function (v) {
                            that.centers.push(v);
                        });
                    }
                });
            });
            that.centers.bind("change", function (e) {
                if (e.action === "itemchange" && e.field === "favorite") {
                    // so change the user's favorites and persist
                    hfc.common.User.favorites = that.centers
                        .filter(function (v) { return v.favorite; })
                        .map(function (v) { return v.centerid; });
                    //hfc.common.log("favorites are " + JSON.stringify(common.User.favorites));
                    $.publish("saveFavorites");
                }
            });
        }
        allvm.prototype.init = function () {
        };
        return allvm;
    })(kendo.data.ObservableObject);
    hfc.allvm = allvm;
})(hfc || (hfc = {}));
define([
    "text!/views/all/all.html"
], function (template) {
    var vm = new hfc.allvm();
    var view = new kendo.View(template, {
        model: vm,
        show: function () { hfc.common.animate(this.element); },
        init: function () { vm.init(); }
    });
    return view;
});
//# sourceMappingURL=all.js.map