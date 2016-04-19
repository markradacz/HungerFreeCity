/// <reference path="../../Scripts/typings/require.d.ts" />
/// <reference path="../../Scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../../Scripts/typings/kendo-ui/kendo-ui.d.ts" />
/// <reference path="../../Scripts/common.d.ts" />
/// <reference path="../../Scripts/typings/google.maps.d.ts" />
declare module hfc {
    class locationvm extends kendo.data.ObservableObject {
        item: any;
        lat: number;
        lng: number;
        private map;
        private marker;
        private infowindow;
        initMap(): void;
        private computeMap();
        setup(item: any): void;
        doAction(e: any): void;
        init(): void;
    }
}
