/// <reference path="../../Scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../../Scripts/typings/kendo-ui/kendo-ui.d.ts" />
/// <reference path="../../Scripts/common.d.ts" />
declare module hfc {
    class homevm extends kendo.data.ObservableObject {
        topNeeds: string;
        loggedIn: boolean;
        favoritesView: kendo.View;
        mapView: kendo.View;
        allView: kendo.View;
        private layout;
        doLogin(e: any): void;
        doRegister(e: any): void;
        tabToggle(e: any): void;
        tabView(id: string): void;
        init(): void;
    }
}
