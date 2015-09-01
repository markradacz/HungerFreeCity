/// <reference path="../../scripts/typings/require.d.ts" />
/// <reference path="../../scripts/typings/jquery.d.ts" />
/// <reference path="../../scripts/typings/kendo.all.d.ts" />
/// <reference path="../../scripts/common.ts" />
module hfc {
    export class centervm extends kendo.data.ObservableObject {
        public title: string = "Center";
        public item: any;  // defined by the manage viewmodel
        public center: kendo.data.DataSource = new kendo.data.DataSource();

        public setup(item, url) {
            this.set("item", item);
            this.set("url", url);
            this.set("center", new kendo.data.DataSource({
                type: "firebase",
                autoSync: false, // true recommended
                transport: { firebase: { url: url } }
            }));
        }

        public init(): void {
        }
    }
}

define([
    'text!views/manage/center.html'
], template => {
    var vm = new hfc.centervm();
    var view = new kendo.View(template, {
        model: vm,
        show: e => { kendo.fx(this.element).fade('in').duration(500).play(); },
        init: () => { vm.init(); }
    });
    return view;
});