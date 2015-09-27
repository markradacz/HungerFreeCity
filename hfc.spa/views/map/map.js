var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path='../../scripts/typings/jquery.d.ts' />
/// <reference path='../../scripts/typings/kendo.all.d.ts' />
/// <reference path='../../scripts/common.ts' />
var hfc;
(function (hfc) {
    var mapvm = (function (_super) {
        __extends(mapvm, _super);
        function mapvm() {
            _super.call(this);
            this.centers = [];
            this.markers = [];
            var that = this;
            $.subscribe("loggedIn", function (ref) {
                ref.child("centers").on("value", function (data) {
                    // convert object to an array
                    that.centers.length = 0; // empty our current array first
                    data.forEach(function (v) {
                        that.centers.push(v.val());
                    });
                    that.initMap();
                });
            });
        }
        mapvm.prototype.initMap = function () {
            var mapInfo = this.computeMap();
            if (!this.map) {
                var mapelement = document.getElementById("homeMap");
                if (mapelement) {
                    this.map = new google.maps.Map(mapelement, {
                        zoom: 11,
                        center: mapInfo.center,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        disableDefaultUI: true
                    });
                    this.infowindow = new google.maps.InfoWindow({ content: "" });
                }
            }
            if (this.map) {
                this.map.setCenter(mapInfo.center);
                this.map.panToBounds(mapInfo.bounds);
                this.addMarkers();
            }
        };
        mapvm.prototype.computeMap = function () {
            var minLat = 200;
            var maxLat = -200;
            var minLng = 200;
            var maxLng = -200;
            var totLat = 0;
            var totLng = 0;
            var totCnt = 0;
            this.centers.forEach(function (c) {
                var lat = c.geometry.coordinates[0];
                var lng = c.geometry.coordinates[1];
                if (lat !== 0 && lng !== 0) {
                    totLat += lat;
                    totLng += lng;
                    if (lat > maxLat)
                        maxLat = lat;
                    if (lng > maxLng)
                        maxLng = lng;
                    if (lat < minLat)
                        minLat = lat;
                    if (lng < minLng)
                        minLng = lng;
                    totCnt++;
                }
            });
            // set the map center to the average lat/lng location
            var avgLat = totLat / totCnt;
            var avgLng = totLng / totCnt;
            return {
                bounds: { north: maxLat, east: maxLng, south: minLat, west: minLng },
                center: { lat: avgLat, lng: avgLng }
            };
        };
        mapvm.prototype.addMarkers = function () {
            var _this = this;
            // clear any markers first
            this.markers.forEach(function (m) { return m.setMap(null); }); // removes current markers
            this.markers.length = 0;
            // add markers to the map
            this.centers.forEach(function (c) {
                var lat = c.geometry.coordinates[0];
                var lng = c.geometry.coordinates[1];
                var marker = new google.maps.Marker({
                    position: { lat: lat, lng: lng },
                    draggable: false,
                    //label: c.name,
                    title: c.name,
                    map: _this.map,
                    animation: google.maps.Animation.DROP
                });
                marker.addListener('click', function () {
                    _this.showInfo(c, marker);
                });
                _this.markers.push(marker);
            });
        };
        mapvm.prototype.showInfo = function (center, marker) {
            this.infowindow.setContent("<table style='width: 300px'><tr>\n\t\t\t\t<td style='vertical-align:top;padding-right:5px;'>\n\t\t\t\t<b>" + center.name + "</b><br/>\n\t\t\t\t<div>" + center.address.address1 + "</div>\n\t\t\t\t<div>" + center.address.address2 + "</div>\n\t\t\t\t<div>" + center.address.city + " " + center.address.state + " " + center.address.zipcode + "</div>\n\t\t\t\t<b>Phone</b><br/>\n\t\t\t\t<div>" + center.phone + "</div>\n\t\t\t\t<b>Hours</b><br/>\n\t\t\t\t<div>" + center.hours + "</div>\n\t\t\t\t<b>Notes</b><br/>\n\t\t\t\t<div>" + center.centerinfo.join("\n") + "</div>\n\t\t\t\t</td><td style='vertical-align:top;'>\n\t\t\t\t<b>Top Needs</b><br/>\n\t\t\t\t<ol style='padding:0;margin-left:15px;'>" + center.needs.slice(0, 10).map(function (v) { return ("<li>" + v.name + "</li>"); }).join("") + "</ol>\n\t\t\t\t</td>\n\t\t\t\t</tr></table>");
            this.infowindow.open(this.map, marker);
        };
        mapvm.prototype.init = function () {
        };
        return mapvm;
    })(kendo.data.ObservableObject);
    hfc.mapvm = mapvm;
})(hfc || (hfc = {}));
define([
    "text!/views/map/map.html"
], function (template) {
    var vm = new hfc.mapvm();
    var view = new kendo.View(template, {
        model: vm,
        show: function () { hfc.common.animate(this.element); vm.initMap(); },
        init: function () { vm.init(); }
    });
    return view;
});
//# sourceMappingURL=map.js.map