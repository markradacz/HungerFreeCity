/// <reference path="typings/jquery/jquery.d.ts" />
/// <reference path="typings/kendo-ui/kendo-ui.d.ts" />
/// <reference path="typings/firebase/firebase.d.ts" />
/// <reference path="typings/require.d.ts" />
declare namespace hfc {
    class common extends kendo.data.ObservableObject {
        static User: any;
        static hasRole(role: string): boolean;
        private static FirebaseUrl;
        static firebase: Firebase;
        static CenterTypes: kendo.data.ObservableArray;
        static CenterTypeOf(ctid: string): any;
        static animate(jelement: JQuery, type?: string): void;
        static successToast(message: string): void;
        static infoToast(message: string): void;
        static warningToast(message: string): void;
        static errorToast(message: string): void;
        private static _getTimeDiff();
        static log(message: string): void;
    }
}
declare module kendo.data.binders.widget {
    import Binder = kendo.data.Binder;
    import Binding = kendo.data.Binding;
    class xdatabound extends Binder {
        constructor(element: Element, bindings: {
            [key: string]: Binding;
        }, options?: any);
        init(element: any, bindings: {
            [key: string]: Binding;
        }, options?: any): void;
        refresh(): void;
    }
    class onEnter extends Binder {
        constructor(element: Element, bindings: {
            [key: string]: Binding;
        }, options?: any);
        init(element: any, bindings: {
            [key: string]: Binding;
        }, options?: any): void;
        refresh(): void;
    }
    class onKeyUp extends Binder {
        constructor(element: Element, bindings: {
            [key: string]: Binding;
        }, options?: any);
        init(element: any, bindings: {
            [key: string]: Binding;
        }, options?: any): void;
        refresh(): void;
    }
    class onComboKeyUp extends Binder {
        constructor(element: Element, bindings: {
            [key: string]: Binding;
        }, options?: any);
        init(element: any, bindings: {
            [key: string]: Binding;
        }, options?: any): void;
        refresh(): void;
    }
}
declare module kendo.data.binders {
    class centerType extends Binder {
        refresh(): void;
    }
    class isChecked extends Binder {
        refresh(): void;
    }
    class tileColor extends Binder {
        refresh(): void;
    }
    class title extends Binder {
        refresh(): void;
    }
    class databoundX extends Binder {
        refresh(): void;
    }
    class subcount extends Binder {
        refresh(): void;
    }
    class combine extends Binder {
        refresh(): void;
    }
    class top10 extends Binder {
        refresh(): void;
    }
    class appearAnimation extends Binder {
        refresh(): void;
    }
    class formattedText extends Binder {
        format: string;
        constructor(element: Element, bindings: {
            [key: string]: Binding;
        }, options?: any);
        refresh(): void;
    }
    class date extends Binder {
        private dateformat;
        constructor(element: Element, bindings: {
            [key: string]: Binding;
        }, options?: any);
        refresh(): void;
    }
    class cssToggle extends Binder {
        c: string;
        nc: string;
        constructor(element: Element, bindings: {
            [key: string]: Binding;
        }, options?: any);
        refresh(): void;
    }
}
