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
    var centervm = (function (_super) {
        __extends(centervm, _super);
        function centervm() {
            _super.apply(this, arguments);
            this.editItem = {};
        }
        centervm.prototype.doAction = function (e) {
            if (e.id === "edit") {
                var clone = JSON.parse(JSON.stringify(this.get("item"))); // cheap way to get a deep clone
                this.set("editItem", clone);
                // popup a dialog box to edit the value
                $("#editCenterPanel").data("kendoWindow").open().center();
            }
            else if (e.id === "save") {
            }
        };
        centervm.prototype.saveButtonClick = function (e) {
            this.set("item", this.get("editItem"));
            // Save the record
            var clone = JSON.parse(JSON.stringify(this.get("item"))); // cheap way to get a deep clone
            delete clone.favorite; // remove this property
            clone.lastModified = new Date().toISOString();
            // common.log("saving center data " + JSON.stringify(clone));
            new Firebase(hfc.common.FirebaseUrl)
                .child(this.get("item").refkey)
                .update(clone, function (error) {
                if (error) {
                    hfc.common.errorToast("Data could not be saved." + error);
                }
                else {
                    hfc.common.successToast("Center saved successfully.");
                }
                $("#editCenterPanel").data("kendoWindow").close();
            });
        };
        centervm.prototype.setup = function (item) {
            this.set("item", item);
        };
        centervm.prototype.init = function () {
            //super.init();
        };
        return centervm;
    })(kendo.data.ObservableObject);
    hfc.centervm = centervm;
})(hfc || (hfc = {}));
define([
    'text!views/center/center.html'
], function (template) {
    var vm = new hfc.centervm();
    var view = new kendo.View(template, {
        model: vm,
        show: function () { hfc.common.animate(this.element); },
        init: function () { vm.init(); }
    });
    return view;
});
//# sourceMappingURL=center.js.map