var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var _this = this;
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
        }
        homevm.prototype.init = function () {
            var vm = this;
            if (hfc.common.User) {
            }
        };
        return homevm;
    })(hfc.BaseViewModel);
    hfc.homevm = homevm;
})(hfc || (hfc = {}));
define([
    'text!views/home/home.html'
], function (homeTemplate) {
    var vm = new hfc.homevm();
    var view = new kendo.View(homeTemplate, {
        model: vm,
        show: function () {
            kendo.fx(_this.element).fade('in').duration(500).play();
        },
        init: function () {
            vm.init();
        }
    });
    return view;
});
//# sourceMappingURL=home.js.map