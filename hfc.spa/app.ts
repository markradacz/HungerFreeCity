/// <reference path="scripts/typings/jquery.d.ts" />
/// <reference path="scripts/typings/kendo.all.d.ts" />
/// <reference path="scripts/typings/require.d.ts" />
/// <reference path="scripts/common.ts" />
define([
    'kendo',
    'views/layout/layout',
    'views/home/home',
    'views/manage/manage',
    'views/about/about'
], (kendo, layout, home, manage, about) => {

    // the application router
    var router = new kendo.Router({
        init: () => {
            // render the layout first
            layout.render('#applicationHost');
        },
        routeMissing: e => {
            // debug shim writes console errors to the browser dev tools
            hfc.common.errorToast('No Route Found' + e.url);
        },
        change: e => {
            // publish an event whenever the route changes
            $.publish('/router/change', [e]);
        }
    });

    // Add new routes here...
    router.route('/', e => {
        layout.showIn('#content', home);
    });

    router.route('/manage', e => {
        layout.showIn('#content', manage);
    });

    router.route('/about', e => {
        layout.showIn('#content', about);
    });

    var ref = new Firebase('https://amber-torch-2255.firebaseio.com/');

    ref.onAuth(authData => {
        if (authData) {
            // save the user's profile into the database so we can list users,
            // use them in Security and Firebase Rules, and show profiles
            ref.child("users").child(authData.uid).set({
                email: authData.password.email
                // provider: authData.provider,
                // provider The authentication method used, in this case: password.  String  
                // uid A unique user ID, intended as the user's unique key across all providers.  String
                // token The Firebase authentication token for this session.  String  
                // auth The contents of the authentication token, which will be available as the auth variable within your Security and Firebase Rules.  Object  
                // expires A timestamp, in seconds since the UNIX epoch, indicating when the authentication token expires.  Number  
                // password An object containing provider-specific data.  Object  
                // password.email The user's email address.  String  
                // password.isTemporaryPassword Whether or not the user authenticated using a temporary password, as used in password reset flows.  Boolean  
                // password.profileImageURL The URL to the user's Gravatar profile image, which is retrieved from hashing the user's email. If the user does not have a Gravatar profile, then a pixelated face is used.  String  
            });
        }
    });

    //var dataSource: kendo.data.DataSource = new kendo.data.DataSource({
    //    type: "firebase",
    //    autoSync: true, // recommended
    //    transport: { firebase: { url: 'https://amber-torch-2255.firebaseio.com/' } }
    //});

    //dataSource.fetch( function() {  // no lambda here so we can use 'this.'
    //    var data = this.data();
    //    hfc.common.log(data.length);
    //    hfc.common.log(JSON.stringify(data));
    //});

    // fetch the latest list of center data
    //ref.on("value", snapshot => {
    //    hfc.common.log(JSON.stringify(snapshot.val()));
    //}, error => {
    //    hfc.common.errorToast("The read failed: " + error.code);
    //});

    var authData = ref.getAuth();
    if (authData) {
        //hfc.common.successToast( 'Already logged in: ' + authData.uid );
        hfc.common.User = authData;
    }

    $.subscribe('/navigate', route => {
        router.navigate(route);
    });

    $.subscribe('register', (email, password) => {
        // submit registration to firebase
        ref.createUser({
            email: email,
            password: password
        }, (error, authData) => {
            if (error) {
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
            } else {
                hfc.common.successToast('Successfully created user account with uid: ' + authData.uid);
                $.publish('registerSuccess', [authData]);
            }
        });
    });

    $.subscribe('login', (email, password) => {
        // validate credentials
        ref.authWithPassword({
            email: email,
            password: password
        }, (error, authData) => {
            if (error) {
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
            } else {
                hfc.common.successToast('Authenticated successfully: ' + authData);
                // publish an event back to the original view
                $.publish('loginSuccess', [authData]);
                router.navigate('/manage');
            }
        });
    });

    $.subscribe('resetPassword', email => {
        ref.resetPassword({
            email: email
        }, error => {
            if (error) {
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
                        hfc.common.errorToast('Error sending password reset email: ' + error);
                }
            } else {
                hfc.common.successToast('Password reset email sent successfully');
                // publish an event back to the original view
                $.publish('resetPasswordSuccess', []);
            }
        });
    });
    return router;
});