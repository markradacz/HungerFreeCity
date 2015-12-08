var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../../scripts/typings/require.d.ts" />
/// <reference path="../../scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../../scripts/typings/kendo-ui/kendo-ui.d.ts" />
/// <reference path="../../scripts/common.ts" />
/// <reference path="../../scripts/typings/google.maps.d.ts" />
var hfc;
(function (hfc) {
    var locationvm = (function (_super) {
        __extends(locationvm, _super);
        function locationvm() {
            _super.apply(this, arguments);
        }
        locationvm.prototype.initMap = function () {
            var _this = this;
            var mapInfo = this.computeMap();
            if (!this.map) {
                var mapelement = document.getElementById("locationMap");
                if (mapelement) {
                    this.map = new google.maps.Map(mapelement, {
                        zoom: 14,
                        center: mapInfo.center,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        disableDefaultUI: true
                    });
                }
            }
            if (this.map) {
                this.map.setCenter(mapInfo.center);
                if (this.marker) {
                    //this.marker.setMap(null); // remove prior marker from map
                    this.infowindow.close();
                    this.marker.setTitle(this.item.name);
                    this.marker.setPosition({ lat: this.lat, lng: this.lng });
                    this.marker.setAnimation(google.maps.Animation.DROP);
                }
                else {
                    this.marker = new google.maps.Marker({
                        position: { lat: this.lat, lng: this.lng },
                        draggable: false,
                        animation: google.maps.Animation.DROP,
                        map: this.map,
                        title: this.item.name
                    });
                    google.maps.event.addListener(this.marker, 'drag', function (e) {
                        _this.set("lat", e.latLng.lat());
                        _this.set("lng", e.latLng.lng());
                    });
                    google.maps.event.addListener(this.marker, 'dragend', function (e) {
                        _this.set("lat", e.latLng.lat());
                        _this.set("lng", e.latLng.lng());
                    });
                    this.infowindow = new google.maps.InfoWindow({ content: "Drag Me to the correct location" });
                }
            }
        };
        locationvm.prototype.computeMap = function () {
            var item = this.get("item");
            var lat = item.geometry.coordinates[0];
            var lng = item.geometry.coordinates[1];
            if (lat < 0 && lng > 0) {
                lat = item.geometry.coordinates[1];
                lng = item.geometry.coordinates[0];
            }
            this.set("lat", lat);
            this.set("lng", lng);
            // set the map center to the lat/lng location
            return {
                center: { lat: lat, lng: lng }
            };
        };
        locationvm.prototype.setup = function (item) {
            this.set("item", item);
            this.initMap();
        };
        locationvm.prototype.doAction = function (e) {
            if (e.id === "edit") {
                this.marker.setDraggable(true);
                this.infowindow.open(this.map, this.marker);
            }
            else if (e.id === "save") {
                this.marker.setDraggable(false);
                this.infowindow.close();
                // common.log("saving center data " + JSON.stringify(clone));
                var item = this.get("item");
                item.geometry.coordinates[0] = this.get("lat");
                item.geometry.coordinates[1] = this.get("lng");
                var clone = JSON.parse(JSON.stringify(item.geometry)); // cheap way to get a deep clone
                hfc.common.firebase
                    .child(item.refkey)
                    .child("geometry")
                    .update(clone, function (error) {
                    if (error) {
                        hfc.common.errorToast("Location data could not be saved." + error);
                    }
                    else {
                        hfc.common.successToast("Location data saved successfully.");
                    }
                });
            }
        };
        locationvm.prototype.init = function () {
        };
        return locationvm;
    })(kendo.data.ObservableObject);
    hfc.locationvm = locationvm;
})(hfc || (hfc = {}));
define([
    'text!/views/location/location.html'
], function (template) {
    var vm = new hfc.locationvm();
    return new kendo.View(template, {
        model: vm,
        show: function () { hfc.common.animate(this.element, "fadeIn"); vm.initMap(); },
        init: function () { vm.init(); }
    });
});
//# sourceMappingURL=location.js.map