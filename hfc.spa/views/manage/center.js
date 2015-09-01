var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var _this = this;
/// <reference path="../../scripts/typings/require.d.ts" />
/// <reference path="../../scripts/typings/jquery.d.ts" />
/// <reference path="../../scripts/typings/kendo.all.d.ts" />
/// <reference path="../../scripts/common.ts" />
var hfc;
(function (hfc) {
    var centervm = (function (_super) {
        __extends(centervm, _super);
        function centervm() {
            _super.apply(this, arguments);
            this.title = "Center";
            this.center = new kendo.data.DataSource();
        }
        centervm.prototype.setup = function (item, url) {
            this.set("item", item);
            this.set("url", url);
            this.set("center", new kendo.data.DataSource({
                type: "firebase",
                autoSync: false,
                transport: { firebase: { url: url } }
            }));
        };
        centervm.prototype.init = function () {
        };
        return centervm;
    })(kendo.data.ObservableObject);
    hfc.centervm = centervm;
})(hfc || (hfc = {}));
define([
    'text!views/manage/center.html'
], function (template) {
    var vm = new hfc.centervm();
    var view = new kendo.View(template, {
        model: vm,
        show: function (e) { kendo.fx(_this.element).fade('in').duration(500).play(); },
        init: function () { vm.init(); }
    });
    return view;
});
//# sourceMappingURL=center.js.map