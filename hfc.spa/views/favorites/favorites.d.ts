/// <reference path="../../Scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../../Scripts/typings/kendo-ui/kendo-ui.d.ts" />
/// <reference path="../../Scripts/common.d.ts" />
declare module hfc {
    class favoritesvm extends kendo.data.ObservableObject {
        centers: kendo.data.ObservableArray;
        init(): void;
        private load;
        constructor();
    }
}
