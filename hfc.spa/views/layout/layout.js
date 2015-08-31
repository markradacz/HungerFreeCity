var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var _this = this;
/// <reference path='../../scripts/typings/jquery.d.ts' />
/// <reference path='../../scripts/typings/kendo.all.d.ts' />
/// <reference path='../../scripts/common.ts' />
var hfc;
(function (hfc) {
    var layoutvm = (function (_super) {
        __extends(layoutvm, _super);
        function layoutvm() {
            _super.apply(this, arguments);
            this.links = [
                { title: 'Home', href: '#/', icon: 'fa fa-home' },
                { title: 'Manage', href: '#/manage', icon: 'fa fa-ellipsis-h' }
            ];
            this.loggedIn = false;
        }
        layoutvm.prototype.showPanel = function (id) {
            var p = $(id).data('kendoWindow');
            p.open();
            p.center();
        };
        layoutvm.prototype.closePanel = function (id) {
            $(id).data('kendoWindow').close();
        };
        layoutvm.prototype.showRegister = function (e) {
            this.closePanel('#loginPanel');
            this.showPanel('#registerPanel');
        };
        layoutvm.prototype.showLogin = function (e) {
            this.closePanel('#forgotPanel');
            this.closePanel('#registerPanel');
            this.showPanel('#loginPanel');
        };
        layoutvm.prototype.showForgot = function (e) {
            this.closePanel('#loginPanel');
            this.showPanel('#forgotPanel');
        };
        layoutvm.prototype.registerButtonClick = function (e) {
            function validateEmail(email) {
                var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                return re.test(email);
            }
            var email = this.get('email');
            var password = this.get('password');
            // validate registration
            if (email == null || !validateEmail(email)) {
                hfc.common.errorToast('Invalid email address: ' + email);
                return;
            }
            if (password == null || password == '') {
                hfc.common.errorToast('Please provide a password');
                return;
            }
            // publish an event to login and navigate
            $.publish('register', [email, password]);
        };
        layoutvm.prototype.loginButtonClick = function (e) {
            // publish an event to login and navigate
            $.publish('login', [this.get('email'), this.get('password')]);
        };
        layoutvm.prototype.resetPasswordButtonClick = function (e) {
            // publish an event to reset the password
            $.publish('resetPassword', [this.get('email')]);
        };
        layoutvm.prototype.init = function (e) {
            var _this = this;
            // cache a reference to the nav links element
            this.nav = e.sender.element.find('#nav-links');
            $.subscribe('routeChange', function (e) {
                // select the nav link based on the current route
                var active = _this.nav.find('a[href="#' + e.url + '"]').parent();
                // if the nav link exists...
                if (active.length > 0) {
                    // remove the active class from all links
                    _this.nav.find('li').removeClass('active');
                    // add the active class to the current link
                    active.addClass('active');
                }
            });
            $.subscribe('userChanged', function () {
                if (hfc.common.User) {
                    _this.set('loggedIn', true);
                    _this.set('email', hfc.common.User.email);
                }
                else {
                    _this.set('loggedIn', false);
                    _this.set('email', "");
                }
            });
            $.subscribe('loginSuccess', function (authData) {
                // close the login panel
                _this.closePanel('#loginPanel');
            });
            $.subscribe('registerSuccess', function (authData) {
                // close the registration panel
                _this.closePanel('#registerPanel');
            });
            $.subscribe('resetPasswordSuccess', function (authData) {
                // close the reset password panel and show the login panel
                _this.closePanel('#forgotPanel');
            });
        };
        return layoutvm;
    })(hfc.BaseViewModel);
    hfc.layoutvm = layoutvm;
})(hfc || (hfc = {}));
define([
    'text!views/layout/layout.html'
], function (layoutTemplate) {
    var vm = new hfc.layoutvm();
    var layout = new kendo.Layout(layoutTemplate, {
        model: vm,
        show: function () {
            kendo.fx(_this.element).fade('in').duration(500).play();
        },
        init: function (e) {
            vm.init(e);
        }
    });
    return layout;
});
//# sourceMappingURL=layout.js.map