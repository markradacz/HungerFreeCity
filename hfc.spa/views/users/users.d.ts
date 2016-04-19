/// <reference path="../../Scripts/typings/require.d.ts" />
/// <reference path="../../Scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../../Scripts/typings/kendo-ui/kendo-ui.d.ts" />
/// <reference path="../../Scripts/common.d.ts" />
declare module hfc {
    class usersvm extends kendo.data.ObservableObject {
        users: kendo.data.ObservableArray;
        user: any;
        canEdit: boolean;
        canView: boolean;
        allRoles: string[];
        centers: any[];
        showUser(e: any): void;
        doAction(e: any): void;
        init(): void;
        constructor();
    }
}
