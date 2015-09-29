/// <reference path="../../scripts/typings/require.d.ts" />
/// <reference path="../../scripts/typings/jquery.d.ts" />
/// <reference path="../../scripts/typings/kendo.all.d.ts" />
/// <reference path="../../scripts/common.ts" />
/// <reference path="../../scripts/typings/google.maps.d.ts" />
module hfc {
	export class locationvm extends kendo.data.ObservableObject {
        public item: any;
		public lat: number;
		public lng: number;
		private map: google.maps.Map;
		private marker: google.maps.Marker;
		private infowindow: google.maps.InfoWindow;

        public initMap(): void {
			const mapInfo = this.computeMap();
			if (!this.map) { // only setup the map object once
				const mapelement = document.getElementById("locationMap");
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
				} else {
					this.marker = new google.maps.Marker({
						position: { lat: this.lat, lng: this.lng },
						draggable: false,
						animation: google.maps.Animation.DROP,
						map: this.map,
						title: this.item.name
					});
					google.maps.event.addListener(this.marker, 'drag', e => {
						this.set("lat", e.latLng.lat());
						this.set("lng", e.latLng.lng());
					});
					google.maps.event.addListener(this.marker, 'dragend', e => {
						this.set("lat", e.latLng.lat());
						this.set("lng", e.latLng.lng());
					});
					this.infowindow = new google.maps.InfoWindow({ content: "Drag Me to the correct location" });
				}
			}
        }

		private computeMap() {
			const item = this.get("item");
			let lat = item.geometry.coordinates[0];
			let lng = item.geometry.coordinates[1];
			if (lat < 0 && lng > 0) {	// swap them
				lat = item.geometry.coordinates[1];
				lng = item.geometry.coordinates[0];
			}
			this.set("lat", lat);
			this.set("lng", lng);
			// set the map center to the lat/lng location
			return {
				center: { lat: lat, lng: lng }
			}
		}

		public setup(item): void {
            this.set("item", item);
			this.initMap();
		}

        public doAction(e: any): void {
            if (e.id === "edit") {
				this.marker.setDraggable(true);
				this.infowindow.open(this.map, this.marker);
            } else if (e.id === "save") {
				this.marker.setDraggable(false);
				this.infowindow.close();
				// common.log("saving center data " + JSON.stringify(clone));
				const item = this.get("item");
				item.geometry.coordinates[0] = this.get("lat");
				item.geometry.coordinates[1] = this.get("lng");

				const clone = JSON.parse(JSON.stringify(item.geometry));	// cheap way to get a deep clone

				new Firebase(common.FirebaseUrl)
					.child(item.refkey)
					.child("geometry")
					.update(clone, error => {
						if (error) {
							common.errorToast("Location data could not be saved." + error);
						} else {
							common.successToast("Location data saved successfully.");
						}
					});
			}
        }

        public init(): void {
        }
    }
}

define([
    'text!/views/location/location.html'
], template => {
    var vm = new hfc.locationvm();
    var view = new kendo.View(template, {
        model: vm,
        show() { hfc.common.animate(this.element, "fadeIn"); vm.initMap(); },
        init() { vm.init(); }
    });
    return view;
});