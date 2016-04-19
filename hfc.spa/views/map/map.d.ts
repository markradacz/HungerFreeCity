/// <reference path="../../Scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../../Scripts/typings/kendo-ui/kendo-ui.d.ts" />
/// <reference path="../../Scripts/common.d.ts" />
declare module hfc {
    class mapvm extends kendo.data.ObservableObject {
        centers: kendo.data.ObservableArray;
        private map;
        private markers;
        private infowindow;
        initMap(): void;
        private computeMap();
        private addMarkers();
        private showInfo(center, marker);
        init(): void;
        constructor();
    }
}
