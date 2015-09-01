/// <reference path="../../scripts/typings/require.d.ts" />
/// <reference path="../../scripts/typings/jquery.d.ts" />
/// <reference path="../../scripts/typings/kendo.all.d.ts" />
/// <reference path="../../scripts/common.ts" />
module hfc {
    export class managevm extends kendo.data.ObservableObject {
        public title: string = "Manage";
        public toolbarVisible: boolean = false;
        public needsView: kendo.View;
        public centerView: kendo.View;
        public locationView: kendo.View;

        public centers: kendo.data.DataSource = new kendo.data.DataSource({
            type: "firebase",
            autoSync: false, // true recommended
            transport: { firebase: { url: hfc.common.FirebaseUrl + "centers" } },
            sort: [
                //{ field: "favorite", dir: "desc" },   // Note: causes re-order when favorite clicked, but listview doesn't show the change
                { field: "name", dir: "asc" }
            ],
            schema: {
                parse(items) {
                    // join in the user's favorited centers
                    if (hfc.common.User && hfc.common.User.favorites) {
                        items.forEach(v => {
                            v.favorite = $.inArray(v.centerid, hfc.common.User.favorites) >= 0;
                        });
                    }
                    return items;
                }
            },
            change: function (e) {
                if (e.action === 'itemchange' && e.field === 'favorite') {
                    common.log('favorite changed on the datasource!');
                    // so change the user's favorites and persist
                    var all = this.data();
                    hfc.common.User.favorites = all.filter(v => v.favorite).map(v => v.centerid);
                    //common.log('favorites are ' + JSON.stringify(hfc.common.User.favorites ) );
                    // persist the user's favorites
                    $.publish('saveFavorites');
                }
            }
        })

        public showCenter(e: any) {
            // get the row of the collection to bind to the subviews
            var listView = $(e.sender.element).data("kendoListView");
            var index = listView.select().index();
            var item = listView.dataSource.view()[index];

            var url: string = common.FirebaseUrl + "centers/" + index;
            //common.log('selected center url is ' + url);

            (<needsvm>this.needsView.model).setup(item, url);
            (<centervm>this.centerView.model).setup(item, url);
            (<locationvm>this.locationView.model).setup(item, url);
            this.layout.showIn("#viewConent", this.needsView);

            // select the Needs button in the toolbar
            var tabtoolbar = $("#tabtoolbar").data("kendoToolBar");
            tabtoolbar.toggle("#needs", true); //select button with id: "foo"
            this.set('toolbarVisible', true);
        }

        public tabToggle(e: any) {
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
            $.subscribe('loggedIn', () => {
                // re-read our datasource upon login, so favorties are matched
                this.centers.read();
            });
            if (hfc.common.User && hfc.common.User.favorites) {
                // re-read our datasource upon login, so favorties are matched
                this.centers.read();
            }
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