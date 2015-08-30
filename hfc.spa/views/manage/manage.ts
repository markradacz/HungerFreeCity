/// <reference path="../../scripts/typings/require.d.ts" />
/// <reference path="../../scripts/typings/jquery.d.ts" />
/// <reference path="../../scripts/typings/kendo.all.d.ts" />
/// <reference path="../../scripts/common.ts" />
module hfc {
    export class managevm extends BaseViewModel {
        public title: string = "Manage";
        public needsView: kendo.View;
        public centerView: kendo.View;
        public locationView: kendo.View;

        public centers: kendo.data.DataSource = new kendo.data.DataSource({
            type: "firebase",
            autoSync: false, // true recommended
            transport: { firebase: { url: hfc.common.FirebaseUrl } }
        });

        public showCenter = e => {
            // hfc.common.log("showCenter");
            // get the row of the collection to bind to the subviews
            var listView = $(e.sender.element).data("kendoListView");
            var index = listView.select().index();
            var item = listView.dataSource.view()[index];
            //hfc.common.log(JSON.stringify(item));

            (<needsvm>this.needsView.model).set('item', item);
            (<centervm>this.centerView.model).set('item', item);
            (<locationvm>this.locationView.model).set('item', item);
            this.layout.showIn("#viewConent", this.needsView);

            // select the Needs button in the toolbar
            var tabtoolbar = $("#tabtoolbar").data("kendoToolBar");
            tabtoolbar.toggle("#needs", true); //select button with id: "foo"
        }

        public tabToggle = e => {
            //e.target jQuery The jQuery object that represents the command element.
            //e.checked Boolean Boolean flag that indicates the button state.
            //e.id String The id of the command element.
            //e.sender kendo.ui.ToolBar The widget instance which fired the event.
            //hfc.common.log("tab toggle: " + e.id + " --> " + e.checked);
            //var row = this.modules.filter(function (r) { return r.id === e.id; });
            //hfc.common.log("data: " + JSON.stringify(row));
            switch (e.id) {
                case "needs": this.layout.showIn("#viewConent", this.needsView); break;
                case "center": this.layout.showIn("#viewConent", this.centerView); break;
                case "location": this.layout.showIn("#viewConent", this.locationView); break;
            }
        }

        private layout: kendo.Layout = new kendo.Layout("<div id='viewConent'/>");
        public init(): void {
            this.layout.render('#tabContent');
        }
    }
}

define([
    'text!views/manage/manage.html',
    'views/manage/needs',
    'views/manage/center',
    'views/manage/location'
], (template, needs, center, location) => {
    var vm = new hfc.managevm();
    vm.needsView = needs;
    vm.centerView = center;
    vm.locationView = location;

    return new kendo.View(template, {
        model: vm,
        show: e => { kendo.fx(this.element).fade('in').duration(500).play(); },
        init: () => { vm.init(); }
    });
});