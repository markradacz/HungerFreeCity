/// <reference path="../../Scripts/typings/require.d.ts" />
/// <reference path="../../Scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../../Scripts/typings/kendo-ui/kendo-ui.d.ts" />
/// <reference path="../../Scripts/common.d.ts" />
declare module hfc {
    class managevm extends kendo.data.ObservableObject {
        toolbarVisible: boolean;
        isAdmin: boolean;
        needsView: kendo.View;
        centerView: kendo.View;
        locationView: kendo.View;
        blankView: kendo.View;
        centers: kendo.data.ObservableArray;
        item: any;
        private layout;
        doAction(e: any): void;
        showCenter(e: any): void;
        onShowRemove(e: any): void;
        onRemove(e: any): void;
        tabToggle(e: any): void;
        tabView(id: string): void;
        listBound(e: any): void;
        init(): void;
        constructor();
    }
}
