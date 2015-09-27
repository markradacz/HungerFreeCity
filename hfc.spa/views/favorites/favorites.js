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
    var favoritesvm = (function (_super) {
        __extends(favoritesvm, _super);
        function favoritesvm() {
            _super.call(this);
            this.centers = new kendo.data.ObservableArray([]);
            var that = this;
            $.subscribe("loggedIn", function (ref) {
                that.load(ref);
            });
            $.subscribe("saveFavorites", function () {
                // re-load the centers when the favorites change
                var ref = new Firebase(hfc.common.FirebaseUrl);
                that.load(ref);
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
        favoritesvm.prototype.init = function () {
        };
        favoritesvm.prototype.load = function (ref) {
            var _this = this;
            ref.child("centers").on("value", function (data) {
                _this.centers.length = 0; // clear the current array
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
                    all.forEach(function (c) {
                        if (c.favorite)
                            _this.centers.push(c);
                    });
                    // compute the top-most need
                    var top = [];
                    all.forEach(function (c) {
                        c.needs.forEach(function (n, i) {
                            var found = jQuery.grep(top, function (t) { return t.name === n.name; });
                            if (found.length > 0)
                                found[0].count += 1 / (i + 1); // weighted per position
                            else
                                top.push({ name: n.name, count: 1 / (i + 1) });
                        });
                    });
                    top.sort(function (a, b) { return (b.count - a.count); }); // descending
                    var topmost = top[0];
                    var allSameTopCount = jQuery.grep(top, function (t) { return t.count === topmost.count; }).map(function (t) { return t.name; }).join(", ");
                    $.publish("topNeeds", [allSameTopCount]);
                }
            });
        };
        return favoritesvm;
    })(kendo.data.ObservableObject);
    hfc.favoritesvm = favoritesvm;
})(hfc || (hfc = {}));
define([
    "text!/views/favorites/favorites.html"
], function (template) {
    var vm = new hfc.favoritesvm();
    var view = new kendo.View(template, {
        model: vm,
        show: function () { hfc.common.animate(this.element); },
        init: function () { vm.init(); }
    });
    return view;
});
//# sourceMappingURL=favorites.js.map