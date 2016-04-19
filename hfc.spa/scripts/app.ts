/// <reference path="typings/jquery/jquery.d.ts" />
/// <reference path="typings/kendo-ui/kendo-ui.d.ts" />
/// <reference path="typings/firebase/firebase.d.ts" />
/// <reference path="typings/require.d.ts" />
/// <reference path="common.ts" />

namespace hfc {
    export class appvm extends kendo.data.ObservableObject {
        public firstName: string;
        public lastName: string;
        public email: string;
        public phone: string;
        public password: string;
        public loggedIn = false;
        public isManager = false;
        public isAdmin = false;
		public isLoggingIn = false;
		public isRegistering = false;
		public isResetting = false;

		private isPanelShowing = false;
        private nav: any;
        private userId: string;

        private showPanel(id: string, title: string): void {
            const p = $(id).data("kendoWindow") as kendo.ui.Window;
			p.title(title);

			if (this.get("isPanelShowing"))
				return;
			this.set("isPanelShowing", true);

            p.open();
            p.center();
        }

        private closePanel(id: string): void {
			this.set("isPanelShowing", false);
            ($(id).data("kendoWindow") as kendo.ui.Window).close();
        }

		public panelClosed(e: any): void {
			this.set("isPanelShowing", false);
            this.set("isLoggingIn", false);
            this.set("isRegistering", false);
			this.set("isResetting", false);
		}

        public showRegister = (e: any) => { // use lambda to ensure _this reference
            this.set("isLoggingIn", false);
            this.set("isRegistering", true);
			this.set("isResetting", false);
			this.showPanel("#loginPanel", "Sign up");
			this.appear("#registerView");
		}

		public showLogin = (e: any) => {
            this.set("isLoggingIn", true);
            this.set("isRegistering", false);
			this.set("isResetting", false);
			this.showPanel("#loginPanel", "Sign in");
			this.appear("#loginView");
		}

        public showForgot(e: any): void {
            this.set("isLoggingIn", false);
            this.set("isRegistering", false);
			this.set("isResetting", true);
			this.showPanel("#loginPanel", "Reset Password");
			this.appear("#forgotView");
		}

        public showUser(e: any): void {
			this.showPanel("#userPanel", this.get("email"));
		}

		public saveUserData(e: any): void {
			const firstName = this.get("firstName");
            const lastName = this.get("lastName");
            const phone = this.get("phone");

			if (firstName == null || firstName === "") {
                common.errorToast("Please provide a First Name");
                return;
            }
            if (lastName == null || lastName === "") {
                common.errorToast("Please provide a Last Name");
                return;
            }

			// save the updated data to the user's profile, as well as the common.User object
			let mod = false;
			if (common.User.firstName !== firstName) {
				common.User.firstName = firstName;
				mod = true;
			}
			if (common.User.lastName !== lastName) {
				common.User.lastName = lastName;
				mod = true;
			}
			if (common.User.phone !== phone) {
				common.User.phone = phone;
				mod = true;
			}

			if (mod) {
				// save the user's profile
				common.firebase
					.child("users")
					.child(common.User.userId)
					.set(common.User)
					.then(() => {
						common.successToast("User information updated");
					});
			}
			this.closePanel("#userPanel");
		}

		private appear(id: string): void {
			const w = kendo.fx($(id));
			const fx = w.fade("in");
			// fx.add(w.slideIn("up"));
			// fx.add(w.zoom("in"));
			// fx.add(w.expand("horizontal"));
			fx.duration(500).play();
		}

        public logoff(): void {
            // Unauthenticate the client
            common.firebase.unauth();
            common.User = null;
            this.setlogin();
        }

        private validateEmail(email: string): boolean {
            const re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            return re.test(email);
        }

        public registerButtonClick(e: any): void {
            const firstName = this.get("firstName");
            const lastName = this.get("lastName");
            const email = this.get("email");
            const password = this.get("password");
            const phone = this.get("phone");

            // validate registration
			if (firstName == null || firstName === "") {
                common.errorToast("Please provide a First Name");
                return;
            }
            if (lastName == null || lastName === "") {
                common.errorToast("Please provide a Last Name");
                return;
            }
            if (email == null || !this.validateEmail(email)) {
                common.errorToast("Invalid email address: " + email);
                return;
            }
            if (password == null || password === "") {
                common.errorToast("Please provide a password");
                return;
            }

            common.firebase.createUser({
                email: email,
                password: password
            })
			.then(userData => {
				// login
				common.firebase.authWithPassword({
					email: email,
					password: password
				})
				.then(authData => {
					// save the user's profile
					common.User = {
						userId: userData.uid,
						firstName: firstName,
						lastName: lastName,
						phone: phone,
						email: email,
						favorites: [],
						centers: [],
						roles: ["user"]
					};
					common.firebase.child("users").child(userData.uid).set(common.User);
					common.successToast("Successfully registered");
					this.closePanel("#loginPanel");
					this.setlogin();
				})
				.catch( error => {
					this.showError(error);						
				});				
			})
			.catch( error => {
				this.showError(error);
            });
        }

        public loginButtonClick(e: any): void {
            // validate credentials
            common.firebase.authWithPassword({
                email: this.get("email"),
                password: this.get("password")
            })
			.then(authData => {
                this.getUserProfile(authData);
                this.closePanel("#loginPanel");
            })
			.catch( error => {
				this.showError(error);		            
	        });        
        }

        public resetPasswordButtonClick(e: any): void {
            common.firebase.resetPassword({
                email: this.get("email")
            })
			.then( () => {
				common.successToast("Password reset email sent");
				this.closePanel("#loginPanel");
	        })
			.catch(error => {
                this.showError(error);
            });
        }

        private showError(error: any): void {
            switch (error.code) {
                case "INVALID_EMAIL":
                    common.errorToast("The specified user account email is invalid.");
                    break;
                case "INVALID_PASSWORD":
                    common.errorToast("The specified user account password is incorrect.");
                    break;
                case "INVALID_USER":
                    common.errorToast("The specified user account does not exist.");
                    break;
                default:
                    common.errorToast("Error signing user in: " + error);
            }
        }

        public routeChange(e: any): void {
            // select the nav link based on the current route
	        const active = this.nav.find("a[href=\"#" + e.url + "\"]").parent(); // if the nav link exists...
            if (active.length > 0) {
                // remove the active class from all links
                this.nav.find("li").removeClass("active");
                // add the active class to the current link
                active.addClass("active");
            }
        }

        private getUserProfile(authData: any): void {
            if (authData) {
                // get the user's profile data
                this.set("userId", authData.uid);
				const uref = common.firebase.child("users").child(authData.uid).ref();
				uref.once("value").then( userData => {
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
                        data.phone = this.get("phone") ? this.get("phone") : "n/a";
                        mod = true;
                    }
                    if (data.firstName === undefined) {
                        data.firstName = this.get("firstName") ? this.get("firstName") : "n/a";
                        mod = true;
                    }
                    if (data.lastName === undefined) {
                        data.lastName = this.get("lastName") ? this.get("lastName") : "n/a";
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

                    if (mod) uref.set(data);
                    common.User = data;
                    this.setlogin();
                });
            }
            else {
                // no auth data, so must not be logged in
                this.setlogin();
            }
        }

        private setlogin(): void {
            if (common.User) {
                common.successToast("Welcome " + common.User.email);
                this.set("loggedIn", true);
				this.set("isManager", common.hasRole("manager") || common.hasRole("admin"));
				this.set("isAdmin", common.hasRole("admin"));
                this.set("email", common.User.email);
                this.set("phone", common.User.phone);
                this.set("firstName", common.User.firstName);
                this.set("lastName", common.User.lastName);
                $.publish("loggedIn");
            } else {
                this.set("loggedIn", false);
				this.set("isManager", false);
				this.set("isAdmin", false);
                common.successToast("Logged off");
                $.publish("loggedOff");
            }
        }

        private saveFavorites = () => {
	        const userId = this.get("userId");
			common.firebase
				.child("users")
				.child(userId)
				.child("favorites")
				.set(common.User.favorites);
			common.successToast("Saved favorites");
        }

        public init(): void {
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
            this.getUserProfile(common.firebase.getAuth());

            $.subscribe("saveFavorites", this.saveFavorites);
            $.subscribe("showLogin", this.showLogin);
            $.subscribe("showRegister", this.showRegister);
        }
    }
}

define([
    "kendo",
    "/views/home/home.js",
    "/views/manage/manage.js",
    "/views/admin/admin.js",
    //"/views/users/users.js",
    "/views/about/about.js",
	"async!https://maps.googleapis.com/maps/api/js?key=AIzaSyBBYD5QWtAgLlUEDApmcU007QZzSnTPCto&sensor=false"
], (kendo, home, manage, admin, about) => {
    var vm = new hfc.appvm();
    kendo.bind("#applicationHost", vm);
    vm.init();

    var layout: kendo.Layout = new kendo.Layout("<div id=\"viewRoot\"/>", {
        show: () => {
			hfc.common.animate(this.element);
			//$(".loader").fadeOut("slow");
			setTimeout(() => { $(".loader").fadeOut("slow"); }, 700);
        }
    });

    // Setup the application router
    var router = new kendo.Router({
        init() { layout.render("#content"); }, // render the layout first
        routeMissing(e) { hfc.common.errorToast("No Route Found" + e.url); }, // debug shim writes console errors to the browser dev tools
        change(e) { vm.routeChange(e); } // whenever the route changes
    });

    // Add routes...
    router.route("/", () => {
	    layout.showIn("#viewRoot", home);
    });
    router.route("/about", () => {
		layout.showIn("#viewRoot", about);
    });
    router.route("/manage", () => {
		if (hfc.common.hasRole("manager") || hfc.common.hasRole("admin"))
			layout.showIn("#viewRoot", manage);
		else
			router.navigate("/");
    });
    router.route("/admin", () => {
		if (hfc.common.hasRole("admin"))
			layout.showIn("#viewRoot", admin);
		else
			router.navigate("/");
    });

	//$.subscribe("loggedIn", () => { router.navigate("/manage"); });
	$.subscribe("loggedOff", () => { router.navigate("/"); });

    return router;
});