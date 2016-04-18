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
    var usersvm = (function (_super) {
        __extends(usersvm, _super);
        function usersvm() {
            _super.call(this);
            this.users = new kendo.data.ObservableArray([]);
            this.user = { email: "", centers: [], roles: [] };
            this.canEdit = false;
            this.canView = false;
            this.allRoles = ["user", "admin", "manager"];
            this.centers = [];
            var that = this;
            $.subscribe("loggedIn", function () {
                hfc.common.firebase.child("users").on("value", function (data) {
                    // convert object to an array
                    var all = [];
                    data.forEach(function (v) {
                        var u = v.val();
                        if (!u.roles)
                            u.roles = ["user"];
                        if (!u.centers)
                            u.centers = [];
                        all.push(u);
                    });
                    all.sort(function (a, b) {
                        return a.email.localeCompare(b.email);
                    });
                    that.users.length = 0; // clear the current array
                    all.forEach(function (v) { that.users.push(v); });
                });
                hfc.common.firebase.child("centers").on("value", function (data) {
                    // convert object to an array
                    var all = [];
                    data.forEach(function (v) {
                        var c = v.val();
                        all.push(c);
                    });
                    all.sort(function (a, b) {
                        return a.name.localeCompare(b.name);
                    });
                    that.centers.length = 0; // clear the current array
                    all.forEach(function (v) { that.centers.push(v); });
                });
            });
        }
        usersvm.prototype.showUser = function (e) {
            var listView = $(e.sender.element).data("kendoListView");
            var index = listView.select().index();
            var user = this.users[index];
            this.set("user", user);
            this.set("canView", true);
            this.set("canEdit", false);
        };
        usersvm.prototype.doAction = function (e) {
            var _this = this;
            if (e.id === "edit") {
                this.set("canEdit", true);
            }
            else if (e.id === "save") {
                // Save the record
                var clone = JSON.parse(JSON.stringify(this.get("user"))); // cheap way to get a deep clone
                clone.lastModified = new Date().toISOString();
                hfc.common.firebase
                    .child("users")
                    .child(clone.userId)
                    .set(clone, function (error) {
                    if (error) {
                        hfc.common.errorToast("Data could not be saved." + error);
                    }
                    else {
                        hfc.common.successToast("User saved successfully.");
                    }
                    _this.set("canEdit", false);
                });
            }
        };
        usersvm.prototype.init = function () {
        };
        return usersvm;
    }(kendo.data.ObservableObject));
    hfc.usersvm = usersvm;
})(hfc || (hfc = {}));
define([
    "text!/views/users/users.html"
], function (template) {
    var vm = new hfc.usersvm();
    return new kendo.View(template, {
        model: vm,
        show: function () { hfc.common.animate(this.element); },
        init: function () { vm.init(); }
    });
});
//# sourceMappingURL=users.js.map