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
    var adminvm = (function (_super) {
        __extends(adminvm, _super);
        function adminvm() {
            _super.call(this);
            this.blankView = new kendo.View("<div/>");
            this.layout = new kendo.Layout("<div id='adminConent'/>");
        }
        adminvm.prototype.tabToggle = function (e) {
            this.tabView(e.id);
        };
        adminvm.prototype.tabView = function (id) {
            switch (id) {
                case "users":
                    this.layout.showIn("#adminConent", this.usersView, "swap");
                    break;
            }
        };
        adminvm.prototype.init = function () {
            this.layout.render("#adminTabs");
        };
        return adminvm;
    }(kendo.data.ObservableObject));
    hfc.adminvm = adminvm;
})(hfc || (hfc = {}));
define([
    "text!/views/admin/admin.html",
    "/views/users/users.js"
], function (template, users) {
    var vm = new hfc.adminvm();
    vm.usersView = users;
    return new kendo.View(template, {
        model: vm,
        show: function () { hfc.common.animate(this.element, "slideUp"); },
        init: function () { vm.init(); }
    });
});
//# sourceMappingURL=admin.js.map