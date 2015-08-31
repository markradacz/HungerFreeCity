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
    var locationvm = (function (_super) {
        __extends(locationvm, _super);
        function locationvm() {
            _super.apply(this, arguments);
            this.title = "Location";
        }
        locationvm.prototype.setup = function (item, url) {
            this.set("item", item);
            this.set("url", url);
        };
        locationvm.prototype.init = function () {
            var _this = this;
            this.bind("change", function (e) {
                var data = _this.get('item');
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
        };
        return locationvm;
    })(hfc.BaseViewModel);
    hfc.locationvm = locationvm;
})(hfc || (hfc = {}));
define([
    'text!views/manage/location.html'
], function (template) {
    var vm = new hfc.locationvm();
    var view = new kendo.View(template, {
        model: vm,
        show: function (e) { kendo.fx(_this.element).fade('in').duration(500).play(); },
        init: function () { vm.init(); }
    });
    return view;
});
//# sourceMappingURL=location.js.map