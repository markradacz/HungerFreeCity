var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../../scripts/typings/require.d.ts" />
/// <reference path="../../scripts/typings/jquery.d.ts" />
/// <reference path="../../scripts/typings/kendo.all.d.ts" />
/// <reference path="../../scripts/common.ts" />
/// <reference path="../../scripts/typings/google.maps.d.ts" />
var hfc;
(function (hfc) {
    var locationvm = (function (_super) {
        __extends(locationvm, _super);
        function locationvm() {
            _super.apply(this, arguments);
        }
        locationvm.prototype.setup = function (item) {
            var _this = this;
            this.set("item", item);
            var lat = item.geometry.coordinates[0];
            var lng = item.geometry.coordinates[1];
            if (lat < 0 && lng > 0) {
                lat = item.geometry.coordinates[1];
                lng = item.geometry.coordinates[0];
            }
            this.set("lat", lat);
            this.set("lng", lng);
            var mapelement = document.getElementById("map");
            if (!mapelement)
                return;
            var map = new google.maps.Map(mapelement, {
                zoom: 14,
                center: { lat: lat, lng: lng },
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: true
            });
            var marker = new google.maps.Marker({
                position: { lat: lat, lng: lng },
                draggable: true,
                animation: google.maps.Animation.DROP,
                map: map,
                title: item.name
            });
            google.maps.event.addListener(marker, 'drag', function (e) {
                _this.set("lat", e.latLng.lat());
                _this.set("lng", e.latLng.lng());
            });
            google.maps.event.addListener(marker, 'dragend', function (e) {
                _this.set("lat", e.latLng.lat());
                _this.set("lng", e.latLng.lng());
            });
        };
        locationvm.prototype.doAction = function (e) {
            if (e.id === "edit") {
            }
            else if (e.id === "save") {
                // common.log("saving center data " + JSON.stringify(clone));
                var item = this.get("item");
                item.geometry.coordinates[0] = this.get("lat");
                item.geometry.coordinates[1] = this.get("lng");
                var clone = JSON.parse(JSON.stringify(item.geometry)); // cheap way to get a deep clone
                new Firebase(hfc.common.FirebaseUrl)
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
    var view = new kendo.View(template, {
        model: vm,
        show: function () { hfc.common.animate(this.element); },
        init: function () { vm.init(); }
    });
    return view;
});
//# sourceMappingURL=location.js.map