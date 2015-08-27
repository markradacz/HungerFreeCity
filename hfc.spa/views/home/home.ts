/// <reference path='../../scripts/typings/jquery.d.ts' />
/// <reference path='../../scripts/typings/kendo.all.d.ts' />
/// <reference path='../../scripts/common.ts' />
module hfc {
    export class homevm extends BaseViewModel {
        public title: string = 'Home';

        public init(): void {
            var vm = this;
            if (hfc.common.User) {
                //vm.set('loggedIn', true);
                //vm.set('email', hfc.common.User.password.email);
            }
        }
    }
}

define([
    'text!views/home/home.html'
], homeTemplate => {
    var vm: hfc.homevm = new hfc.homevm();
    var view: kendo.View = new kendo.View(homeTemplate, {
        model: vm,
        show: () => {
            kendo.fx(this.element).fade('in').duration(500).play();
        },
        init: () => {
            vm.init();
        }
    });
    return view;
});