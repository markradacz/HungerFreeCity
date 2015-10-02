var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _this = this;
/// <reference path="typings/jquery.d.ts" />
/// <reference path="typings/kendo.all.d.ts" />
/// <reference path="typings/firebase.d.ts" />
/// <reference path="typings/require.d.ts" />
/// <reference path="common.ts" />
var hfc;
(function (hfc) {
    var appvm = (function (_super) {
        __extends(appvm, _super);
        function appvm() {
            var _this = this;
            _super.apply(this, arguments);
            this.loggedIn = false;
            this.isManager = false;
            this.isAdmin = false;
            this.isLoggingIn = false;
            this.isRegistering = false;
            this.isResetting = false;
            this.isPanelShowing = false;
            this.ref = new Firebase(hfc.common.FirebaseUrl);
            this.showRegister = function (e) {
                _this.set("isLoggingIn", false);
                _this.set("isRegistering", true);
                _this.set("isResetting", false);
                _this.showPanel("#loginPanel", "Sign Up");
                _this.appear("#registerView");
            };
            this.showLogin = function (e) {
                _this.set("isLoggingIn", true);
                _this.set("isRegistering", false);
                _this.set("isResetting", false);
                _this.showPanel("#loginPanel", "Log In");
                _this.appear("#loginView");
            };
            this.saveFavorites = function () {
                var userId = _this.get("userId");
                _this.ref
                    .child("users")
                    .child(userId)
                    .child("favorites")
                    .set(hfc.common.User.favorites);
                hfc.common.successToast("Saved favorites");
            };
        }
        appvm.prototype.showPanel = function (id, title) {
            var p = $(id).data("kendoWindow");
            p.title(title);
            if (this.get("isPanelShowing"))
                return;
            this.set("isPanelShowing", true);
            p.open();
            p.center();
        };
        appvm.prototype.closePanel = function (id) {
            this.set("isPanelShowing", false);
            $(id).data("kendoWindow").close();
        };
        appvm.prototype.panelClosed = function (e) {
            this.set("isPanelShowing", false);
            this.set("isLoggingIn", false);
            this.set("isRegistering", false);
            this.set("isResetting", false);
        };
        appvm.prototype.showForgot = function (e) {
            this.set("isLoggingIn", false);
            this.set("isRegistering", false);
            this.set("isResetting", true);
            this.showPanel("#loginPanel", "Reset Password");
            this.appear("#forgotView");
        };
        appvm.prototype.showUser = function (e) {
            this.showPanel("#userPanel", this.get("email"));
        };
        appvm.prototype.saveUserData = function (e) {
            var firstName = this.get("firstName");
            var lastName = this.get("lastName");
            var phone = this.get("phone");
            if (firstName == null || firstName === "") {
                hfc.common.errorToast("Please provide a First Name");
                return;
            }
            if (lastName == null || lastName === "") {
                hfc.common.errorToast("Please provide a Last Name");
                return;
            }
            // save the updated data to the user's profile, as well as the common.User object
            var mod = false;
            if (hfc.common.User.firstName !== firstName) {
                hfc.common.User.firstName = firstName;
                mod = true;
            }
            if (hfc.common.User.lastName !== lastName) {
                hfc.common.User.lastName = lastName;
                mod = true;
            }
            if (hfc.common.User.phone !== phone) {
                hfc.common.User.phone = phone;
                mod = true;
            }
            if (mod) {
                // save the user's profile
                this.ref.child("users").child(hfc.common.User.userId).set(hfc.common.User);
                hfc.common.successToast("User information updated");
            }
            this.closePanel("#userPanel");
        };
        appvm.prototype.appear = function (id) {
            var w = kendo.fx($(id));
            var fx = w.fade("in");
            // fx.add(w.slideIn("up"));
            // fx.add(w.zoom("in"));
            // fx.add(w.expand("horizontal"));
            fx.duration(500).play();
        };
        appvm.prototype.logoff = function () {
            // Unauthenticate the client
            this.ref.unauth();
            hfc.common.User = null;
            this.setlogin();
        };
        appvm.prototype.validateEmail = function (email) {
            var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            return re.test(email);
        };
        appvm.prototype.registerButtonClick = function (e) {
            var _this = this;
            var firstName = this.get("firstName");
            var lastName = this.get("lastName");
            var email = this.get("email");
            var password = this.get("password");
            var phone = this.get("phone");
            // validate registration
            if (firstName == null || firstName === "") {
                hfc.common.errorToast("Please provide a First Name");
                return;
            }
            if (lastName == null || lastName === "") {
                hfc.common.errorToast("Please provide a Last Name");
                return;
            }
            if (email == null || !this.validateEmail(email)) {
                hfc.common.errorToast("Invalid email address: " + email);
                return;
            }
            if (password == null || password === "") {
                hfc.common.errorToast("Please provide a password");
                return;
            }
            this.ref.createUser({
                email: email,
                password: password
            }, function (error, userData) {
                if (error) {
                    _this.showError(error);
                }
                else {
                    // login
                    _this.ref.authWithPassword({
                        email: email,
                        password: password
                    }, function (error, authData) {
                        if (error) {
                            _this.showError(error);
                        }
                        else {
                            // save the user's profile
                            hfc.common.User = {
                                userId: userData.uid,
                                firstName: firstName,
                                lastName: lastName,
                                phone: phone,
                                email: email,
                                favorites: [],
                                centers: [],
                                roles: ["user"]
                            };
                            _this.ref.child("users").child(userData.uid).set(hfc.common.User);
                            hfc.common.successToast("Successfully registered");
                            _this.closePanel("#loginPanel");
                            _this.setlogin();
                        }
                    });
                }
            });
        };
        appvm.prototype.loginButtonClick = function (e) {
            var _this = this;
            // validate credentials
            this.ref.authWithPassword({
                email: this.get("email"),
                password: this.get("password")
            }, function (error, authData) {
                if (error) {
                    _this.showError(error);
                }
                else {
                    _this.getUserProfile(authData);
                    _this.closePanel("#loginPanel");
                }
            });
        };
        appvm.prototype.resetPasswordButtonClick = function (e) {
            var _this = this;
            this.ref.resetPassword({
                email: this.get("email")
            }, function (error) {
                if (error) {
                    _this.showError(error);
                }
                else {
                    hfc.common.successToast("Password reset email sent");
                    _this.closePanel("#loginPanel");
                }
            });
        };
        appvm.prototype.showError = function (error) {
            switch (error.code) {
                case "INVALID_EMAIL":
                    hfc.common.errorToast("The specified user account email is invalid.");
                    break;
                case "INVALID_PASSWORD":
                    hfc.common.errorToast("The specified user account password is incorrect.");
                    break;
                case "INVALID_USER":
                    hfc.common.errorToast("The specified user account does not exist.");
                    break;
                default:
                    hfc.common.errorToast("Error logging user in: " + error);
            }
        };
        appvm.prototype.routeChange = function (e) {
            // select the nav link based on the current route
            var active = this.nav.find("a[href=\"#" + e.url + "\"]").parent(); // if the nav link exists...
            if (active.length > 0) {
                // remove the active class from all links
                this.nav.find("li").removeClass("active");
                // add the active class to the current link
                active.addClass("active");
            }
        };
        appvm.prototype.getUserProfile = function (authData) {
            var _this = this;
            if (authData) {
                // get the user's profile data
                this.set("userId", authData.uid);
                var uref = this.ref.child("users").child(authData.uid).ref();
                uref.once("value", function (userData) {
                    var data = userData.val();
                    var mod = false;
                    if (data.userId === null) {
                        data.userId = authData.uid;
                        mod = true;
                    }
                    if (data.email === undefined) {
                        data.email = authData.password.email;
                        mod = true;
                    }
                    if (data.phone === undefined) {
                        data.phone = _this.get("phone") ? _this.get("phone") : "n/a";
                        mod = true;
                    }
                    if (data.firstName === undefined) {
                        data.firstName = _this.get("firstName") ? _this.get("firstName") : "n/a";
                        mod = true;
                    }
                    if (data.lastName === undefined) {
                        data.lastName = _this.get("lastName") ? _this.get("lastName") : "n/a";
                        mod = true;
                    }
                    if (data.favorites === undefined) {
                        data.favorites = [];
                        mod = true;
                    }
                    if (data.centers === undefined) {
                        data.centers = [];
                        mod = true;
                    }
                    if (data.roles === undefined) {
                        data.roles = ["user"];
                        mod = true;
                    }
                    if (mod)
                        uref.set(data);
                    hfc.common.User = data;
                    _this.setlogin();
                });
            }
            else {
                // no auth data, so must not be logged in
                this.setlogin();
            }
        };
        appvm.prototype.setlogin = function () {
            if (hfc.common.User) {
                hfc.common.successToast("Welcome " + hfc.common.User.email);
                this.set("loggedIn", true);
                this.set("isManager", hfc.common.hasRole("manager") || hfc.common.hasRole("admin"));
                this.set("isAdmin", hfc.common.hasRole("admin"));
                this.set("email", hfc.common.User.email);
                this.set("phone", hfc.common.User.phone);
                this.set("firstName", hfc.common.User.firstName);
                this.set("lastName", hfc.common.User.lastName);
                $.publish("loggedIn", [this.ref]);
            }
            else {
                this.set("loggedIn", false);
                this.set("isManager", false);
                this.set("isAdmin", false);
                hfc.common.successToast("Logged off");
                $.publish("loggedOff");
            }
        };
        appvm.prototype.init = function () {
            //super.init();
            // cache a reference to the nav links element
            this.set("nav", $("#nav-links"));
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
            $.subscribe("saveFavorites", this.saveFavorites);
            $.subscribe("showLogin", this.showLogin);
            $.subscribe("showRegister", this.showRegister);
        };
        return appvm;
    })(kendo.data.ObservableObject);
    hfc.appvm = appvm;
})(hfc || (hfc = {}));
define([
    "kendo",
    "/views/home/home.js",
    "/views/manage/manage.js",
    //"/views/admin/admin.js"
    "/views/users/users.js",
    "async!https://maps.googleapis.com/maps/api/js?key=AIzaSyBBYD5QWtAgLlUEDApmcU007QZzSnTPCto&sensor=false"
], function (kendo, home, manage, admin) {
    var vm = new hfc.appvm();
    kendo.bind("#applicationHost", vm);
    vm.init();
    var layout = new kendo.Layout("<div id=\"viewRoot\"/>", {
        show: function () {
            hfc.common.animate(_this.element);
            //$(".loader").fadeOut("slow");
            setTimeout(function () { $(".loader").fadeOut("slow"); }, 700);
        }
    });
    // Setup the application router
    var router = new kendo.Router({
        init: function () { layout.render("#content"); },
        routeMissing: function (e) { hfc.common.errorToast("No Route Found" + e.url); },
        change: function (e) { vm.routeChange(e); } // whenever the route changes
    });
    // Add routes...
    router.route("/", function () {
        layout.showIn("#viewRoot", home);
    });
    router.route("/manage", function () {
        if (hfc.common.hasRole("manager") || hfc.common.hasRole("admin"))
            layout.showIn("#viewRoot", manage);
        else
            router.navigate("/");
    });
    router.route("/admin", function () {
        if (hfc.common.hasRole("admin"))
            layout.showIn("#viewRoot", admin);
        else
            router.navigate("/");
    });
    //$.subscribe("loggedIn", () => { router.navigate("/manage"); });
    $.subscribe("loggedOff", function () { router.navigate("/"); });
    return router;
});
//# sourceMappingURL=app.js.map