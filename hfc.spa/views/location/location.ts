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

        public setup(item): void {
            this.set("item", item);

			let lat = item.geometry.coordinates[0];
			let lng = item.geometry.coordinates[1];
			if (lat < 0 && lng > 0) {	// swap them
				lat = item.geometry.coordinates[1];
				lng = item.geometry.coordinates[0];
			}

			this.set("lat", lat);
			this.set("lng", lng);

			const mapelement = document.getElementById("map");
			if (!mapelement) return;

			const map = new google.maps.Map(mapelement, {
				zoom: 14,
				center: { lat: lat, lng: lng },
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				disableDefaultUI: true
			});

			const marker = new google.maps.Marker({
				position: { lat: lat, lng: lng },
				draggable: true,
				animation: google.maps.Animation.DROP,
				map: map,
				title: item.name
			});

			google.maps.event.addListener(marker, 'drag', e => {
				this.set("lat", e.latLng.lat());
				this.set("lng", e.latLng.lng());
			});
			google.maps.event.addListener(marker, 'dragend', e => {
				this.set("lat", e.latLng.lat());
				this.set("lng", e.latLng.lng());
			});
		}

        public doAction(e: any): void {
            if (e.id === "edit") {
			} else if (e.id === "save") {
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
        show() { hfc.common.animate(this.element); },
        init() { vm.init(); }
    });
    return view;
});