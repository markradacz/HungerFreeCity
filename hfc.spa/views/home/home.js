var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path='../../scripts/typings/jquery.d.ts' />
/// <reference path='../../scripts/typings/kendo.all.d.ts' />
/// <reference path='../../scripts/common.ts' />
var hfc;
(function (hfc) {
    var homevm = (function (_super) {
        __extends(homevm, _super);
        function homevm() {
            _super.apply(this, arguments);
            this.title = 'Home';
            this.loggedIn = false;
        }
        homevm.prototype.doLogin = function (e) {
            $.publish("showLogin");
        };
        homevm.prototype.doRegister = function (e) {
            $.publish("showRegister");
        };
        homevm.prototype.init = function () {
            var _this = this;
            //super.init();
            $.subscribe("loggedIn", function () { _this.set('loggedIn', true); });
            $.subscribe("loggedOff", function () { _this.set('loggedIn', false); });
            this.set('loggedIn', hfc.common.User ? true : false);
        };
        return homevm;
    })(kendo.data.ObservableObject);
    hfc.homevm = homevm;
})(hfc || (hfc = {}));
define([
    'text!/views/home/home.html'
], function (homeTemplate) {
    var vm = new hfc.homevm();
    var view = new kendo.View(homeTemplate, {
        model: vm,
        show: function () { hfc.common.animate(this.element, "slideUp"); },
        init: function () { vm.init(); }
    });
    return view;
});
//# sourceMappingURL=home.js.map