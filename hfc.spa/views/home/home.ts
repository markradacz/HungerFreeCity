/// <reference path='../../scripts/typings/jquery.d.ts' />
/// <reference path='../../scripts/typings/kendo.all.d.ts' />
/// <reference path='../../scripts/common.ts' />
module hfc {
    export class homevm extends kendo.data.ObservableObject {
        public title: string = 'Home';
        public loggedIn: boolean = false;

        public doLogin(e: any): void {
            $.publish("showLogin");
        }

        public doRegister(e: any): void {
            $.publish("showRegister");
        }

        public init(): void {
			//super.init();
            $.subscribe("loggedIn", () => { this.set('loggedIn', true); });
            $.subscribe("loggedOff", () => { this.set('loggedIn', false); });
            this.set('loggedIn', common.User ? true : false);
        }
    }
}

define([
    'text!views/home/home.html'
], homeTemplate => {
    var vm: hfc.homevm = new hfc.homevm();
    var view: kendo.View = new kendo.View(homeTemplate, {
        model: vm,
        show() { hfc.common.animate(this.element, "slideUp"); },
        init() { vm.init(); }
    });
    return view;
});