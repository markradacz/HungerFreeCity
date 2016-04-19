/// <reference path="../../Scripts/typings/require.d.ts" />
/// <reference path="../../Scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../../Scripts/typings/kendo-ui/kendo-ui.d.ts" />
/// <reference path="../../Scripts/common.d.ts" />
declare module hfc {
    class needsvm extends kendo.data.ObservableObject {
        static instance: needsvm;
        initialized: boolean;
        need: any;
        item: any;
        isLinked: boolean;
        adding: boolean;
        centers: kendo.data.ObservableArray;
        setup(item: any, centers: any): void;
        doLinkAction(e: any): void;
        doAction(e: any): void;
        private saveNeeds();
        private saveCenterNeeds(centerItem);
        onEdit(e: any): void;
        onShowRemove(e: any): void;
        onRemove(e: any): void;
        onItemSelected(e: any): void;
        private reorderItems();
        onDataBound(): void;
        private updateCenter();
        private saveButtonClick(e);
        init(): void;
    }
}
