/// <reference path='../../scripts/typings/jquery.d.ts' />
/// <reference path='../../scripts/typings/kendo.all.d.ts' />
/// <reference path='../../scripts/common.ts' />
module hfc {
    export class mapvm extends kendo.data.ObservableObject {
		private centers: any[] = [];
		private map: google.maps.Map;
		private markers: google.maps.Marker[] = [];
		private infowindow: google.maps.InfoWindow;

        public initMap(): void {
	        const mapInfo = this.computeMap();
	        if (!this.map) { // only setup the map object once
				const mapelement = document.getElementById("homeMap");
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
        }

		private computeMap() {
			var minLat = 200;
			var maxLat = -200;
			var minLng = 200;
			var maxLng = -200;
			var totLat = 0;
			var totLng = 0;
			var totCnt = 0;

			this.centers.forEach(c => {
				var lat = c.geometry.coordinates[0];
				var lng = c.geometry.coordinates[1];
				if (lat !== 0 && lng !== 0) {
					totLat += lat;
					totLng += lng;
					if (lat > maxLat) maxLat = lat;
					if (lng > maxLng) maxLng = lng;
					if (lat < minLat) minLat = lat;
					if (lng < minLng) minLng = lng;
					totCnt++;
				}
			});

			// set the map center to the average lat/lng location
			const avgLat = totLat / totCnt;
			const avgLng = totLng / totCnt;
			
			return {
			    bounds: { north: maxLat, east: maxLng, south: minLat, west: minLng },
			    center: { lat: avgLat, lng: avgLng }
		    }
	    }

	    private addMarkers() {
			// clear any markers first
			this.markers.forEach(m => m.setMap(null));	// removes current markers
			this.markers.length = 0;

			// add markers to the map
			this.centers.forEach(c => {
				var lat = c.geometry.coordinates[0];
				var lng = c.geometry.coordinates[1];
				var marker = new google.maps.Marker({
					position: { lat: lat, lng: lng },
					draggable: false,
					//label: c.name,
					title: c.name, // + " " + lat + " " + lng,
					map: this.map,
					animation: google.maps.Animation.DROP
				});
				marker.addListener('click', () => {
					this.showInfo(c, marker);
				});
				this.markers.push(marker);
			});
		}

		private showInfo(center: any, marker: google.maps.Marker) {
			this.infowindow.setContent(
				`<table style='width: 300px'><tr>
				<td style='vertical-align:top;padding-right:5px;'>
				<b>${center.name}</b><br/>
				<div>${center.address.address1}</div>
				<div>${center.address.address2}</div>
				<div>${center.address.city} ${center.address.state} ${center.address.zipcode}</div>
				<b>Phone</b><br/>
				<div>${center.phone}</div>
				<b>Hours</b><br/>
				<div>${center.hours}</div>
				<b>Notes</b><br/>
				<div>${center.centerinfo.join("\n")}</div>
				<b>Site</b><br/>
				<a href="${center.site}" target="blank" style="white-space:nowrap;">${center.site} <span class="fa fa-external-link" /></a>
				</td><td style='vertical-align:top;'>
				<b>Top Needs</b><br/>
				<ol style='padding:0;margin-left:15px;'>${center.needs.slice(0, 10).map(v => `<li>${v.name}</li>`).join("")}</ol>
				</td>
				</tr></table>`
			);
			this.infowindow.open(this.map, marker);
		}

	    public init(): void {
	    }

	    public constructor() {
            super();
			var that = this;
			$.subscribe("loggedIn", (ref: Firebase) => {
                ref.child("centers").on("value", data => {
					// convert object to an array
	                that.centers.length = 0; // empty our current array first
					data.forEach(v => {
						that.centers.push(v.val());
					});
					that.initMap();
				});
            });
        }
    }
}

define([
    "text!/views/map/map.html"
], template => {
    var vm: hfc.mapvm = new hfc.mapvm();
    var view: kendo.View = new kendo.View(template, {
        model: vm,
        show() { hfc.common.animate(this.element); vm.initMap(); },
        init() { vm.init(); }
    });
    return view;
});