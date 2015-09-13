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
    var usersvm = (function (_super) {
        __extends(usersvm, _super);
        function usersvm() {
            _super.call(this);
            this.users = new kendo.data.ObservableArray([]);
            this.user = { email: "" };
            var that = this;
            $.subscribe("loggedIn", function (ref) {
                ref.child("users").on("value", function (data) {
                    that.users.length = 0; // clear the current array
                    // join in the user's favorited centers, and add each to the collection
                    if (hfc.common.User && hfc.common.User.favorites) {
                        var key = data.key();
                        var all = [];
                        // convert object to an array
                        data.forEach(function (v) {
                            var u = v.val();
                            u.refkey = key + "/" + v.key();
                            if (!u.roles)
                                u.roles = ["user"];
                            all.push(u);
                        });
                        all.sort(function (a, b) {
                            return a.email.localeCompare(b.email);
                        });
                        all.forEach(function (v) { that.users.push(v); });
                    }
                });
            });
        }
        usersvm.prototype.showUser = function (e) {
            // get the row of the collection to bind to the subviews
            var listView = $(e.sender.element).data("kendoListView");
            var index = listView.select().index();
            var user = this.users[index];
            this.set("user", user);
        };
        usersvm.prototype.init = function () {
        };
        return usersvm;
    })(kendo.data.ObservableObject);
    hfc.usersvm = usersvm;
})(hfc || (hfc = {}));
define([
    "text!views/users/users.html"
], function (template) {
    var vm = new hfc.usersvm();
    return new kendo.View(template, {
        model: vm,
        show: function () { hfc.common.animate(this.element, "slideUp"); },
        init: function () { vm.init(); }
    });
});
//# sourceMappingURL=users.js.map