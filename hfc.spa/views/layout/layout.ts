/// <reference path='../../scripts/typings/jquery.d.ts' />
/// <reference path='../../scripts/typings/kendo.all.d.ts' />
/// <reference path='../../scripts/common.ts' />
module hfc {
    export class layoutvm extends BaseViewModel {
        public links: any = [
            { title: 'Home', href: '#/', icon: 'fa fa-home' },
            { title: 'Manage', href: '#/manage', icon: 'fa fa-ellipsis-h' }
        ];
        public loggedIn: boolean = false;
        public email: string;
        public password: string;
        private nav: any;

        private showPanel(id: string): void {
            var p = $(id).data('kendoWindow');
            p.open();
            p.center();
        }

        private closePanel(id: string): void {
            $(id).data('kendoWindow').close();
        }

        public showRegister(e: any): void {
            this.closePanel('#loginPanel');
            this.showPanel('#registerPanel');
        }

        public showLogin(e: any): void {
            this.closePanel('#forgotPanel');
            this.closePanel('#registerPanel');
            this.showPanel('#loginPanel');
        }

        public showForgot(e: any): void {
            this.closePanel('#loginPanel');
            this.showPanel('#forgotPanel');
        }

        public registerButtonClick(e: any): void {
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
        }

        public loginButtonClick(e: any): void {
            // publish an event to login and navigate
            $.publish('login', [this.get('email'), this.get('password')]);
        }

        public resetPasswordButtonClick(e: any): void {
            // publish an event to reset the password
            $.publish('resetPassword', [this.get('email')]);
        }

        public init(e: any): void {
            var vm = this;

            // cache a reference to the nav links element
            vm.nav = e.sender.element.find('#nav-links');
            $.subscribe('/router/change', function (e) {
                // select the nav link based on the current route
                var active = vm.nav.find('a[href="#' + e.url + '"]').parent();
                // if the nav link exists...
                if (active.length > 0) {
                    // remove the active class from all links
                    vm.nav.find('li').removeClass('active');
                    // add the active class to the current link
                    active.addClass('active');
                }
            });

            if (hfc.common.User) {
                vm.set('loggedIn', true);
                vm.set('email', hfc.common.User.password.email);
            }

            $.subscribe('loginSuccess', function (authData) {
                vm.set('loggedIn', true);
                vm.set('email', hfc.common.User.password.email);
                // close the login panel
                vm.closePanel('#loginPanel');
            });

            $.subscribe('registerSuccess', function (authData) {
                // close the registration panel
                vm.closePanel('#registerPanel');
            });

            $.subscribe('resetPasswordSuccess', function (authData) {
                // close the reset password panel and show the login panel
                vm.closePanel('#forgotPanel');
            });
        }
    }
}

define([
    'text!views/layout/layout.html'
], (layoutTemplate) => {
    var vm = new hfc.layoutvm();
    var layout: kendo.Layout = new kendo.Layout(layoutTemplate, {
        model: vm,
        show: () => {
            kendo.fx(this.element).fade('in').duration(500).play();
        },
        init: e => {
            vm.init(e);
        }
    });
    return layout;
});