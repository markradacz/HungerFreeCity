/// <reference path="../../scripts/typings/require.d.ts" />
/// <reference path="../../scripts/typings/jquery.d.ts" />
/// <reference path="../../scripts/typings/kendo.all.d.ts" />
/// <reference path="../../scripts/common.ts" />
module hfc {
    export class centervm extends kendo.data.ObservableObject {
        public title = "Center";
        public item: any;  // defined by the manage viewmodel

        public setup(item) {
            this.set("item", item);
        }

        public init(): void {
        }
    }
}

define([
    'text!views/center/center.html'
], template => {
    var vm = new hfc.centervm();
    var view = new kendo.View(template, {
        model: vm,
        show() { hfc.common.animate(this.element); },
        init() { vm.init(); }
    });
    return view;
});