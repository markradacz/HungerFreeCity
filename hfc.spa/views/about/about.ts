module hfc {
	export class aboutvm extends kendo.data.ObservableObject {
        public init(): void {
        }
	}
}

define([
    "text!/views/about/about.html"
], template => {
    var vm = new hfc.aboutvm();
    return new kendo.View(template, {
        model: vm,
        show() { hfc.common.animate(this.element); },
        init() { vm.init(); }
    });
});