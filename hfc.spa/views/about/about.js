define([
    'text!views/about/about.html'
], function (template) {

    var viewModel = kendo.observable({
        title: 'About'
    });

    var view = new kendo.View(template, {
        model: viewModel,
        show: function (e) {
            kendo.fx(this.element).fade('in').duration(500).play();
        }
    });

    return view;
});