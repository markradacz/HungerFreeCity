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
            transport: { firebase: { url: 'https://amber-torch-2255.firebaseio.com/' } }
        });

        //public centers: any[] = [
        //    { id: 1, Name: "Southside Food Bank", Address: "123 Southside Blvd.", Favorite: true },
        //    { id: 2, Name: "Beaches Donation Center", Address: "929 San Pablo Rd.", Favorite: false },
        //    { id: 3, Name: "Downtown Food Network", Address: "555 Main St.", Favorite: false }
        //];

        public showCenter = e => {
            hfc.common.log("showCenter");
            // todo: figure out which row of the collection to bind to the subviews
            (<needsvm>this.needsView.model).centers = this.centers;
            (<centervm>this.centerView.model).centers = this.centers;
            (<locationvm>this.locationView.model).centers = this.centers;
            this.layout.showIn("#viewConent", this.needsView);
        }

        public tabToggle = e => {
            //e.target jQuery The jQuery object that represents the command element.
            //e.checked Boolean Boolean flag that indicates the button state.
            //e.id String The id of the command element.
            //e.sender kendo.ui.ToolBar The widget instance which fired the event.
            hfc.common.log("tab toggle: " + e.id + " --> " + e.checked);
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