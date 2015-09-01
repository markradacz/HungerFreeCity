/// <reference path="scripts/typings/jquery.d.ts" />
/// <reference path="scripts/typings/kendo.all.d.ts" />
/// <reference path="scripts/typings/firebase.d.ts" />
/// <reference path="scripts/typings/require.d.ts" />
/// <reference path="scripts/common.ts" />
module hfc {
    export class appvm extends kendo.data.ObservableObject {
        public loggedIn: boolean = false;
        public email: string;
        public password: string;
        private nav: any;
        private ref: Firebase = new Firebase(hfc.common.FirebaseUrl);
        private userId: string;

        private showPanel(id: string): void {
            var p = $(id).data('kendoWindow');
            p.open();
            p.center();
        }

        private closePanel(id: string): void {
            $(id).data('kendoWindow').close();
        }

        public showRegister = (e: any) => { // use lambda to ensure _this reference
            this.closePanel('#loginPanel');
            this.showPanel('#registerPanel');
        }

        public showLogin = (e: any) => {
            this.closePanel('#forgotPanel');
            this.closePanel('#registerPanel');
            this.showPanel('#loginPanel');
        }

        public showForgot(e: any): void {
            this.closePanel('#loginPanel');
            this.showPanel('#forgotPanel');
        }

        public logoff(): void {
            hfc.common.User = null;
            this.setlogin();
            // Unauthenticate the client
            this.ref.unauth();
            // TODO: make sure we are moved to the Home tab
        }

        private validateEmail(email : string): boolean {
            var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            return re.test(email);
        }

        public registerButtonClick(e: any): void {

            var email = this.get('email');
            var password = this.get('password');

            // validate registration
            if (email == null || !this.validateEmail(email)) {
                hfc.common.errorToast('Invalid email address: ' + email);
                return;
            }

            if (password == null || password == '') {
                hfc.common.errorToast('Please provide a password');
                return;
            }

            this.ref.createUser({
                email: email,
                password: password
            }, (error, authData) => {
                if (error) {
                    this.showError(error);
                } else {
                    hfc.common.successToast('Successfully registered');
                    // close the registration panel
                    this.closePanel('#registerPanel');
                    this.loginButtonClick(e);
                }
            });
        }

        public loginButtonClick(e: any): void {
            // validate credentials
            this.ref.authWithPassword({
                email: this.get('email'),
                password: this.get('password')
            }, (error, authData) => {
                if (error) {
                    this.showError(error);
                } else {
                    this.getUserProfile(authData);
                    // close the login panel
                    this.closePanel('#loginPanel');
                }
            });
        }

        public resetPasswordButtonClick(e: any): void {
            this.ref.resetPassword({
                email: this.get('email')
            }, error => {
                if (error) {
                    this.showError(error);
                } else {
                    hfc.common.successToast('Password reset email sent successfully');
                    // close the reset password panel and show the login panel
                    this.closePanel('#forgotPanel');
                }
            });
        }

        private showError(error: any): void {
            switch (error.code) {
                case "INVALID_EMAIL":
                    hfc.common.errorToast('The specified user account email is invalid.');
                    break;
                case "INVALID_PASSWORD":
                    hfc.common.errorToast('The specified user account password is incorrect.');
                    break;
                case "INVALID_USER":
                    hfc.common.errorToast('The specified user account does not exist.');
                    break;
                default:
                    hfc.common.errorToast('Error logging user in: ' + error);
            }
        }

        public routeChange(e: any): void {
            // select the nav link based on the current route
            var active = this.nav.find('a[href="#' + e.url + '"]').parent();
            // if the nav link exists...
            if (active.length > 0) {
                // remove the active class from all links
                this.nav.find('li').removeClass('active');
                // add the active class to the current link
                active.addClass('active');
            }
        }

        private getUserProfile(authData: any): void {
            if (authData) {
                // get the user's profile data
                this.set('userId', authData.uid);
                var uref = this.ref.child('users').child(authData.uid).ref();
                uref.once('value', userData => {
                    var data = userData.val() || {
                        userId: authData.uid,
                        email: authData.password.email,
                        favorites: []
                    };
                    var mod: boolean = false;
                    if (data.userId === undefined) {
                        data.userId = authData.uid;
                        mod = true;
                    }
                    if (data.email === undefined) {
                        data.email = authData.password.email;
                        mod = true;
                    }
                    if (data.favorites === undefined) {
                        data.favorites = [];
                        mod = true;
                    }
                    if(mod) uref.set(data);
                    hfc.common.User = data;
                    this.setlogin();
                });
            }
            else {
                // no auth data, so must not be logged in
                this.setlogin();
            }
        }

        private setlogin(): void {
            if (hfc.common.User) {
                hfc.common.successToast('Welcome back ' + hfc.common.User.email);
                this.set('loggedIn', true);
                this.set('email', hfc.common.User.email);
                $.publish("loggedIn");
            } else {
                this.set('loggedIn', false);
                //this.set('email', "");
                //this.set('password', "");
                hfc.common.successToast('Logged off');
                $.publish("loggedOff");
            }
        }

        private saveFavorites = () => {
            var userId = this.get('userId');
            var favRef = this.ref.child('users').child(userId).child('favorites').ref();
            favRef.set(hfc.common.User.favorites);
        }

        public init(): void {
            // cache a reference to the nav links element
            this.set('nav', $('#nav-links'));

            //ref.onAuth(authData => {    // NOT CALLED when the user is already authenticated and remembered
            //    // provider: authData.provider,
            //    // provider The authentication method used, in this case: password.  String  
            //    // uid A unique user ID, intended as the user's unique key across all providers.  String
            //    // token The Firebase authentication token for this session.  String  
            //    // auth The contents of the authentication token, which will be available as the auth variable within your Security and Firebase Rules.  Object  
            //    // expires A timestamp, in seconds since the UNIX epoch, indicating when the authentication token expires.  Number  
            //    // password An object containing provider-specific data.  Object  
            //    // password.email The user's email address.  String  
            //    // password.isTemporaryPassword Whether or not the user authenticated using a temporary password, as used in password reset flows.  Boolean  
            //    // password.profileImageURL The URL to the user's Gravatar profile image, which is retrieved from hashing the user's email. If the user does not have a Gravatar profile, then a pixelated face is used.  String  
            //    if (authData) {
            //        // save the user's profile into the database so we can list users,
            //        // use them in Security and Firebase Rules, and show profiles
            //        // TODO: don't overwrite when already exists!
            //        hfc.common.successToast('You have been authenticated!' + authData.uid);
            //    }
            //});

            // get the user's profile data
            this.getUserProfile(this.ref.getAuth());

            $.subscribe('saveFavorites', this.saveFavorites);       
            $.subscribe('showLogin', this.showLogin);       
            $.subscribe('showRegister', this.showRegister);
        }
    }
}

define([
    'kendo',
    'views/home/home',
    'views/manage/manage',
    'views/about/about'
], (kendo, home, manage, about) => {

    var vm = new hfc.appvm();
    kendo.bind('#applicationHost', vm);
    vm.init();

    var layout: kendo.Layout = new kendo.Layout( '<div id="viewRoot"/>', {
        show: () => { kendo.fx(this.element).fade('in').duration(500).play(); },
    });

    // Setup the application router
    var router = new kendo.Router({
        init() { layout.render('#content'); }, // render the layout first
        routeMissing(e) { hfc.common.errorToast('No Route Found' + e.url); }, // debug shim writes console errors to the browser dev tools
        change(e) { vm.routeChange(e); } // whenever the route changes
    });

    // Add new routes here...
    router.route('/', () => { layout.showIn('#viewRoot', home); });
    router.route('/manage', () => { layout.showIn('#viewRoot', manage); });
    router.route('/about', () => { layout.showIn('#viewRoot', about); });

    return router;
});