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
], function (kendo, layout, home, manage, about) {
    // Setup the application router
    var router = new kendo.Router({
        init: function () { layout.render('#applicationHost'); },
        routeMissing: function (e) { hfc.common.errorToast('No Route Found' + e.url); },
        change: function (e) { $.publish('routeChange', [e]); } // publish an event whenever the route changes
    });
    // Add new routes here...
    router.route('/', function (e) { layout.showIn('#content', home); });
    router.route('/manage', function (e) { layout.showIn('#content', manage); });
    router.route('/about', function (e) { layout.showIn('#content', about); });
    var ref = new Firebase(hfc.common.FirebaseUrl);
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
    var userRef;
    var authData = ref.getAuth();
    if (authData) {
        // get the user's profile data
        userRef = ref.child('users').child(authData.uid).ref();
        userRef.on('value', function (userData) {
            var data = userData.val();
            if (data) {
                if (data.favorites === undefined) {
                    data.favorites = [];
                    userRef.set(data);
                }
                hfc.common.User = data;
                $.publish('userChanged');
                hfc.common.successToast('Welcome back ' + data.email);
            }
            else {
                hfc.common.User = {
                    email: authData.password.email,
                    favorites: []
                };
                userRef.set(hfc.common.User);
                $.publish('userChanged');
                hfc.common.successToast('Welcome aboard ' + data.email);
            }
        });
    }
    $.subscribe('saveFavorites', function () {
        var favRef = userRef.child('favorites').ref();
        favRef.set(hfc.common.User.favorites);
    });
    $.subscribe('navigate', function (route) {
        router.navigate(route);
    });
    $.subscribe('register', function (email, password) {
        // submit registration to firebase
        ref.createUser({
            email: email,
            password: password
        }, function (error, authData) {
            if (error) {
                showError(error);
            }
            else {
                hfc.common.successToast('Successfully created user account with uid: ' + authData.uid);
                $.publish('registerSuccess', [authData]);
            }
        });
    });
    $.subscribe('login', function (email, password) {
        // validate credentials
        ref.authWithPassword({
            email: email,
            password: password
        }, function (error, authData) {
            if (error) {
                showError(error);
            }
            else {
                hfc.common.successToast('Authenticated successfully: ' + authData);
                // publish an event back to the original view
                $.publish('loginSuccess', [authData]);
                router.navigate('/manage');
            }
        });
    });
    $.subscribe('resetPassword', function (email) {
        ref.resetPassword({
            email: email
        }, function (error) {
            if (error) {
                showError(error);
            }
            else {
                hfc.common.successToast('Password reset email sent successfully');
                // publish an event back to the original view
                $.publish('resetPasswordSuccess', []);
            }
        });
    });
    function showError(error) {
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
    return router;
});
//# sourceMappingURL=app.js.map