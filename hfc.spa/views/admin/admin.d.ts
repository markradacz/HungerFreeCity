/// <reference path="../../Scripts/typings/require.d.ts" />
/// <reference path="../../Scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../../Scripts/typings/kendo-ui/kendo-ui.d.ts" />
/// <reference path="../../Scripts/common.d.ts" />
declare module hfc {
    class adminvm extends kendo.data.ObservableObject {
        usersView: kendo.View;
        blankView: kendo.View;
        private layout;
        tabToggle(e: any): void;
        tabView(id: string): void;
        init(): void;
        constructor();
    }
}
