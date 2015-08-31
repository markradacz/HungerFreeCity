/// <reference path="../../scripts/typings/require.d.ts" />
/// <reference path="../../scripts/typings/jquery.d.ts" />
/// <reference path="../../scripts/typings/kendo.all.d.ts" />
/// <reference path="../../scripts/common.ts" />
module hfc {
    export class locationvm extends BaseViewModel {
        public title: string = "Location";
        public item: any;  // defined by the manage viewmodel

        public setup(item, url) {
            this.set("item", item);
            this.set("url", url);
        }

        public init(): void {
            this.bind("change", e => {
                var data = this.get('item');
                var lat = data.geometry.coordinates[0];
                var lng = data.geometry.coordinates[1];
                $("#map").kendoMap({
                    center: [lat, lng],
                    zoom: 15,
                    controls: {
                        attribution: false,
                        navigator: false,
                        zoom: false
                    },
                    layers: [{
                        type: "tile",
                        urlTemplate: "http://#= subdomain #.tile.openstreetmap.org/#= zoom #/#= x #/#= y #.png",
                        subdomains: ["a", "b", "c"],
                        attribution: "&copy; <a href='http://osm.org/copyright'>OpenStreetMap contributors</a>"
                    }],
                    markers: [{
                        location: [lat, lng],
                        shape: "pinTarget",
                        tooltip: { content: data.name }
                    }]
                });
                //$("#map").data("kendoMap").resize(true);
            });
        }
    }
}

define([
    'text!views/manage/location.html'
], template => {
    var vm = new hfc.locationvm();
    var view = new kendo.View(template, {
        model: vm,
        show: e => { kendo.fx(this.element).fade('in').duration(500).play(); },
        init: () => { vm.init(); }
    });
    return view;
});