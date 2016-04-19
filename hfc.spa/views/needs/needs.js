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
    var needsvm = (function (_super) {
        __extends(needsvm, _super);
        function needsvm() {
            _super.apply(this, arguments);
            this.initialized = false; // set in the databound() method below
            this.need = null;
            this.isLinked = false;
            this.centers = new kendo.data.ObservableArray([]);
        }
        needsvm.prototype.setup = function (item, centers) {
            needsvm.instance = this;
            if (!item.linked)
                item.linked = "";
            this.set("item", item);
            this.set("centers", centers);
            this.reorderItems();
        };
        needsvm.prototype.doLinkAction = function (e) {
            var toolbar = $("#centerLinkToolbar").data("kendoToolBar");
            if (e.id === "yes") {
                this.set("isLinked", true);
                toolbar.show($("#dropDownSegment"));
            }
            if (e.id === "no") {
                this.set("isLinked", false);
                // TODO: get the List from the last linked center into this center
                this.item.linked = "";
                toolbar.hide($("#dropDownSegment"));
                this.updateCenter();
            }
        };
        needsvm.prototype.doAction = function (e) {
            var _this = this;
            if (e.id === "add") {
                // popup a dialog box to edit the value
                this.set("need", {
                    name: "New Item",
                    onShowRemove: function (e) { _this.onShowRemove(e); },
                    onRemove: function (e) { _this.onRemove(e); }
                });
                this.set("adding", true);
                $("#editNeedPanel").data("kendoWindow").open().center();
            }
        };
        needsvm.prototype.saveNeeds = function () {
            var _this = this;
            // common.log("saving center data " + JSON.stringify(clone));
            var item = this.get("item");
            this.saveCenterNeeds(item);
            // find linked centers and update their needs too
            this.centers.forEach(function (c) {
                if (c.linked === item.centerid) {
                    c.needs = item.needs;
                    // save the center's needs
                    _this.saveCenterNeeds(c);
                }
            });
        };
        needsvm.prototype.saveCenterNeeds = function (centerItem) {
            var clone = JSON.parse(JSON.stringify(centerItem.needs)); // cheap way to get a deep clone
            clone.lastModified = new Date().toISOString();
            var ref = hfc.common.firebase.child(centerItem.refkey);
            ref.child("needs")
                .set(clone)
                .then(function () {
                hfc.common.successToast("Needs data saved successfully.");
            })
                .catch(function (error) {
                hfc.common.errorToast("Needs data could not be saved." + error);
            });
        };
        needsvm.prototype.onEdit = function (e) {
            // popup a dialog box to edit the value
            var listView = $("#needsList").data("kendoListView");
            var index = listView.select().index();
            this.set("need", this.item.needs[index]);
            this.set("adding", false);
            $("#editNeedPanel").data("kendoWindow").open().center();
        };
        needsvm.prototype.onShowRemove = function (e) {
            var listView = $("#needsList").data("kendoListView");
            var elem = listView.select()[0];
            $(elem)
                .find("button.confirmRemoveNeed")
                .animate({ display: "inline", width: "70px", opacity: 1.0 }, 400);
        };
        needsvm.prototype.onRemove = function (e) {
            // find which item is selected
            var listView = $("#needsList").data("kendoListView");
            var index = listView.select().index();
            var item = this.item.needs[index];
            this.item.needs.remove(item);
            this.reorderItems();
            this.saveNeeds();
        };
        needsvm.prototype.onItemSelected = function (e) {
            //var listView = $('#needsList').data("kendoListView");
            //var index = listView.select().index();
            //var item = listView.dataSource.view()[index];
            $(".needItem button.confirmRemoveNeed").each(function () {
                var op = $(this).css("opacity");
                if (op > "0") {
                    $(this).animate({ display: "none", width: "0px", opacity: 0 }, 200);
                }
            });
        };
        needsvm.prototype.reorderItems = function () {
            var _this = this;
            // reset the index values
            var needs = needsvm.instance.get("item").get("needs");
            var index = 0;
            needs.forEach(function (v) {
                v.set("index", ++index);
                v.onShowRemove = function (e) { _this.onShowRemove(e); };
                v.onRemove = function (e) { _this.onRemove(e); };
            });
        };
        needsvm.prototype.onDataBound = function () {
            var _this = this;
            // make the listview sortable and all the items within draggable
            $("#needsList").kendoSortable({
                filter: ">div.needItem",
                //cursor: "move",
                placeholder: function (element) {
                    return element.clone().css("opacity", 0.5);
                },
                hint: function (element) {
                    return element.clone().removeClass("k-state-selected");
                },
                change: function (e) {
                    var oldIndex = e.oldIndex, newIndex = e.newIndex, needs = needsvm.instance.get("item").get("needs"), need = needs[oldIndex];
                    needs.remove(need);
                    needs.splice(newIndex, 0, need); // insert at new index
                    needsvm.instance.reorderItems();
                    window.setTimeout(function () { needsvm.instance.saveNeeds(); }, 1); // background save
                }
            });
            // TODO: prevent linking for centers that are themselves referenced as links
            var toolbar = $("#centerLinkToolbar").data("kendoToolBar");
            if (!toolbar)
                return;
            var init = this.get("initialized");
            if (!init) {
                // only do this once
                toolbar.add({ template: "<input id='centerDropdown'/>", id: "dropDownSegment" });
                this.set("initialized", true);
            }
            var item = this.get("item");
            $("#centerDropdown").kendoDropDownList({
                optionLabel: "Linked Center",
                dataTextField: "name",
                dataValueField: "centerid",
                valuePrimitive: false,
                dataSource: this.centers.filter(function (c) {
                    return c.centerid !== item.centerid && !c.linked;
                }),
                value: item.linked,
                select: function (e) {
                    // Use the selected item or its text
                    var chosenlink = e.sender.dataItem(e.item);
                    var item = _this.get("item");
                    if (item.linked !== chosenlink.centerid) {
                        item.linked = chosenlink.centerid;
                        // TODO: get the List from the linked center into this center
                        // update the item
                        _this.updateCenter();
                    }
                }
            });
            if (item.linked !== "") {
                this.set("isLinked", true);
                toolbar.toggle("#yes", true);
                toolbar.show($("#dropDownSegment"));
            }
            else {
                this.set("isLinked", false);
                toolbar.toggle("#no", true);
                toolbar.hide($("#dropDownSegment"));
            }
        };
        needsvm.prototype.updateCenter = function () {
            var item = this.get("item");
            var clone = JSON.parse(JSON.stringify(item)); // cheap way to get a deep clone
            delete clone.favorite; // remove this property
            delete clone.refkey; // remove this property
            clone.lastModified = new Date().toISOString();
            var ref = hfc.common.firebase.child(item.refkey);
            ref.update(clone, function (error) {
                if (error) {
                    hfc.common.errorToast("Center data could not be updated." + error);
                }
                else {
                    hfc.common.successToast("Center data updated successfully.");
                }
            });
        };
        needsvm.prototype.saveButtonClick = function (e) {
            if (this.get("adding")) {
                var needs = this.get("item").get("needs");
                needs.unshift(this.get("need"));
                this.reorderItems();
                this.set("adding", false);
            }
            $("#editNeedPanel").data("kendoWindow").close();
            this.saveNeeds();
        };
        needsvm.prototype.init = function () {
            //super.init();
        };
        needsvm.instance = null; // set in the setup() method below
        return needsvm;
    }(kendo.data.ObservableObject));
    hfc.needsvm = needsvm;
})(hfc || (hfc = {}));
define([
    "text!/views/needs/needs.html",
    "kendo"
], function (template) {
    var vm = new hfc.needsvm();
    var view = new kendo.View(template, {
        model: vm,
        show: function () { hfc.common.animate(this.element); },
        init: function () { vm.init(); }
    });
    return view;
});
//# sourceMappingURL=needs.js.map