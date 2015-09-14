module hfc {
	export class aboutvm extends kendo.data.ObservableObject {
        title: string = "About";

        public init(): void {
	        //super.init();
        }
	}
}

define([
    "text!../views/about/about.html"
], template => {
    var vm = new hfc.aboutvm();
    var view = new kendo.View(template, {
        model: vm,
        show() { hfc.common.animate(this.element); },
        init() { vm.init(); }
    });
    return view;
});