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
    // the application router
    var router = new kendo.Router({
        init: function () {
            // render the layout first
            layout.render('#applicationHost');
        },
        routeMissing: function (e) {
            // debug shim writes console errors to the browser dev tools
            hfc.common.errorToast('No Route Found' + e.url);
        },
        change: function (e) {
            // publish an event whenever the route changes
            $.publish('/router/change', [e]);
        }
    });
    // Add new routes here...
    router.route('/', function (e) {
        layout.showIn('#content', home);
    });
    router.route('/manage', function (e) {
        layout.showIn('#content', manage);
    });
    router.route('/about', function (e) {
        layout.showIn('#content', about);
    });
    var ref = new Firebase(hfc.common.FirebaseUrl);
    ref.onAuth(function (authData) {
        if (authData) {
            // save the user's profile into the database so we can list users,
            // use them in Security and Firebase Rules, and show profiles
            ref.child("users").child(authData.uid).set({
                email: authData.password.email
            });
        }
    });
    //var dataSource: kendo.data.DataSource = new kendo.data.DataSource({
    //    type: "firebase",
    //    autoSync: true, // recommended
    //    transport: { firebase: { url: hfc.common.FirebaseUrl } }
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
    $.subscribe('/navigate', function (route) {
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