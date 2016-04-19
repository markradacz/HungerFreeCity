/// <reference path="typings/jquery/jquery.d.ts" />
/// <reference path="typings/kendo-ui/kendo-ui.d.ts" />
/// <reference path="typings/firebase/firebase.d.ts" />
/// <reference path="typings/require.d.ts" />
/// <reference path="common.d.ts" />
declare namespace hfc {
    class appvm extends kendo.data.ObservableObject {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        password: string;
        loggedIn: boolean;
        isManager: boolean;
        isAdmin: boolean;
        isLoggingIn: boolean;
        isRegistering: boolean;
        isResetting: boolean;
        private isPanelShowing;
        private nav;
        private userId;
        private showPanel(id, title);
        private closePanel(id);
        panelClosed(e: any): void;
        showRegister: (e: any) => void;
        showLogin: (e: any) => void;
        showForgot(e: any): void;
        showUser(e: any): void;
        saveUserData(e: any): void;
        private appear(id);
        logoff(): void;
        private validateEmail(email);
        registerButtonClick(e: any): void;
        loginButtonClick(e: any): void;
        resetPasswordButtonClick(e: any): void;
        private showError(error);
        routeChange(e: any): void;
        private getUserProfile(authData);
        private setlogin();
        private saveFavorites;
        init(): void;
    }
}
