var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var hfc;
(function (hfc) {
    var aboutvm = (function (_super) {
        __extends(aboutvm, _super);
        function aboutvm() {
            _super.apply(this, arguments);
        }
        aboutvm.prototype.init = function () {
        };
        return aboutvm;
    })(kendo.data.ObservableObject);
    hfc.aboutvm = aboutvm;
})(hfc || (hfc = {}));
define([
    "text!/views/about/about.html"
], function (template) {
    var vm = new hfc.aboutvm();
    var view = new kendo.View(template, {
        model: vm,
        show: function () { hfc.common.animate(this.element); },
        init: function () { vm.init(); }
    });
    return view;
});
//# sourceMappingURL=about.js.map