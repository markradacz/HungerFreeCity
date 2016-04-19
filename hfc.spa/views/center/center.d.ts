/// <reference path="../../Scripts/typings/require.d.ts" />
/// <reference path="../../Scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../../Scripts/typings/kendo-ui/kendo-ui.d.ts" />
/// <reference path="../../Scripts/common.d.ts" />
declare module hfc {
    class centervm extends kendo.data.ObservableObject {
        item: any;
        canEdit: boolean;
        CenterTypes: kendo.data.ObservableArray;
        doAction(e: any): void;
        setup(item: any): void;
        init(): void;
    }
}
