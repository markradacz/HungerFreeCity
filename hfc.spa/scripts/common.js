/// <reference path="typings/jquery/jquery.d.ts" />
/// <reference path="typings/kendo-ui/kendo-ui.d.ts" />
/// <reference path="typings/firebase/firebase.d.ts" />
/// <reference path="typings/require.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var hfc;
(function (hfc) {
    var common = (function (_super) {
        __extends(common, _super);
        function common() {
            _super.apply(this, arguments);
        }
        common.hasRole = function (role) {
            return common.User && common.User.roles && common.User.roles.indexOf(role) >= 0;
        };
        common.CenterTypeOf = function (ctid) {
            return common.CenterTypes.filter(function (c) {
                return c.id === ctid;
            })[0];
        };
        common.animate = function (jelement, type) {
            var wrapper = kendo.fx(jelement);
            var effect = wrapper.fade("in");
            switch (type) {
                //case "fadeIn":
                //effect = wrapper.fade( "in" );
                //	break;
                case "fadeOut":
                    effect = wrapper.fade("out");
                    break;
                case "expandHorizontal":
                    effect.add(wrapper.expand("horizontal"));
                    break;
                case "expandVertical":
                    effect.add(wrapper.expand("vertical"));
                    break;
                case "slideLeft":
                    effect.add(wrapper.slideIn("left"));
                    break;
                case "slideRight":
                    effect.add(wrapper.slideIn("right"));
                    break;
                case "slideUp":
                    effect.add(wrapper.slideIn("up"));
                    break;
                case "slideDown":
                    effect.add(wrapper.slideIn("down"));
                    break;
                case "zoomIn":
                    effect.add(wrapper.zoom("in"));
                    break;
                case "zoomOut":
                    effect.add(wrapper.zoom("out"));
                    break;
            }
            effect.duration(1000).play();
        };
        /*-----------------------------------------------------
        Toast Notifications
        -----------------------------------------------------*/
        common.successToast = function (message) {
            var w = $("#notification").data("kendoNotification");
            if (w)
                w.show({ message: message }, "success");
        };
        common.infoToast = function (message) {
            var w = $("#notification").data("kendoNotification");
            if (w)
                w.show({ message: message }, "info");
        };
        common.warningToast = function (message) {
            var w = $("#notification").data("kendoNotification");
            if (w)
                w.show({ message: message }, "warning");
        };
        common.errorToast = function (message) {
            var w = $("#notification").data("kendoNotification");
            if (w)
                w.show({ message: message }, "error");
        };
        /*-----------------------------------------------------
        Debug Logging
        -----------------------------------------------------*/
        common._getTimeDiff = function () { return new Date().getTime() - performance.timing.navigationStart; };
        common.log = function (message) {
            if (window.console) {
                console.log(this._getTimeDiff() + "ms: " + message);
            }
        };
        //constructor(objToObserve) {
        //	super(objToObserve);
        //	super.init(this);
        //}
        /*-----------------------------------------------------
        User
        -----------------------------------------------------*/
        common.User = null;
        /*-----------------------------------------------------
        Firebase
        -----------------------------------------------------*/
        common.FirebaseUrl = 'https://hungerfreecity.firebaseio.com/';
        common.firebase = new Firebase(common.FirebaseUrl);
        common.CenterTypes = new kendo.data.ObservableArray([
            { id: "DONATE", name: "Donation Center", description: "Collects donations and delivers to a local Food Bank" },
            { id: "PANTRY", name: "Food Pantry", description: "Food Pantry collects donations for their own distribution, and delivers to a local Food Bank" },
            { id: "BANK", name: "Food Bank", description: "Collects donations and distributes to folks in need through multiple outlets" }
        ]);
        return common;
    }(kendo.data.ObservableObject));
    hfc.common = common;
})(hfc || (hfc = {}));
// extend jQuery with a new indexByPropertyValue() function that looks for an array item with a matching property value
jQuery.extend({
    indexByPropertyValue: function (array, propertyName, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][propertyName] === value)
                return i;
        }
        return undefined;
    }
});
// extend jQuery with a new findByPropertyValue() function that looks for an array item with a matching property value
jQuery.extend({
    findByPropertyValue: function (array, propertyName, value) {
        for (var i = 0; i < array.length; i++) {
            var v = array[i];
            if (v[propertyName] === value)
                return v;
        }
        return null;
    }
});
// extend jQuery with a new distinctByProperty() function that does an in-place edit of the array removing duplicates; favoring early values rather than latter
jQuery.extend({
    distinctByProperty: function (obj, propertyName) {
        $.each(obj, function (i, v) {
            if (v === undefined || v === null)
                return; // may encounter missing items if they were sliced away below
            var prop = v[propertyName];
            for (var ii = i + 1; ii < obj.length; ii++) {
                if (obj[ii][propertyName] === prop) {
                    // remove the array element at ii; as it is a duplicate
                    obj.splice(ii, 1);
                }
            }
        });
    }
});
// extend jQuery with a new replaceOrAddItem() function
jQuery.extend({
    replaceOrAddItem: function (array, keyPropertyName, keyValue, replacementItem) {
        // common.log("replaceOrAddItem: " + array.length + " of " + keyPropertyName + " = " + keyValue + " with " + JSON.stringify(replacementItem));
        // slice(0) used here to copy the array to avoid sequence bugs since we remove items in-place
        if (array.length > 0) {
            $.each(array.slice(0), function (i, v) {
                if (v[keyPropertyName] === keyValue) {
                    array.splice(i, 1);
                }
            });
        }
        array.push(replacementItem);
    }
});
// extend jQuery with a new sortItems() function
jQuery.extend({
    sortItems: function (array, keyPropertyName) {
        // slice(0) used here to copy the array
        var copy = array.slice(0);
        copy.sort(function (a, b) {
            var a1 = a[keyPropertyName], b1 = b[keyPropertyName];
            if (a1 === b1)
                return 0;
            return a1 > b1 ? 1 : -1;
        });
        // empty the original array and set the new values
        array.splice(0, array.length);
        // add the items back in the sorted order
        $.each(copy, function (i, v) { array.push(v); });
    }
});
// this adds 'placeholder' to the items listed in the jQuery .support object
jQuery(function () {
    jQuery.support["placeholder"] = false;
    var test = document.createElement("input");
    if ("placeholder" in test)
        jQuery.support["placeholder"] = true;
});
// This adds placeholder support to browsers that wouldn't otherwise support it
jQuery(function () {
    if (!$.support["placeholder"]) {
        var active = document.activeElement;
        $(":text").focus(function () {
            if ($(this).attr("placeholder") !== "" && $(this).val() === $(this).attr("placeholder")) {
                $(this).val("").removeClass("k-readonly");
            }
        }).blur(function () {
            if ($(this).attr("placeholder") !== "" && ($(this).val() === "" || $(this).val() === $(this).attr("placeholder"))) {
                $(this).val($(this).attr("placeholder")).addClass("k-readonly");
            }
        });
        $(":text").blur();
        $(active).focus();
        $("form:eq(0)").submit(function () { $(":text.k-readonly").val(""); });
    }
});
var kendo;
(function (kendo) {
    var data;
    (function (data) {
        var binders;
        (function (binders) {
            var widget;
            (function (widget) {
                var Binder = kendo.data.Binder;
                var xdatabound = (function (_super) {
                    __extends(xdatabound, _super);
                    function xdatabound(element, bindings, options) {
                        _super.call(this, element, bindings, options);
                    }
                    xdatabound.prototype.init = function (element, bindings, options) {
                        _super.prototype.init.call(this, element, bindings, options);
                        //const binding = this.bindings["xdatabound"];
                    };
                    xdatabound.prototype.refresh = function () {
                        var binding = this.bindings["xdatabound"];
                        try {
                            // common.log("xdatabound: on " + this.element.tagName + " with " + binding.path);
                            // var fn = that.bindings["xdatabound"].get();	// calls the function! don't want that
                            var fn = binding.source.get(binding.path);
                            if (!fn)
                                fn = eval(binding.path); // see if we can get a function reference by an eval
                            if (!fn)
                                fn = window[binding.path]; // see if we can get a function reference within the global window object
                            if (fn)
                                fn(this.element, binding.source);
                            else
                                hfc.common.log("xdatabound error: function doesn't exist: on " + this.element.tagName + " with " + binding.path + " on source " + JSON.stringify(binding.source));
                        }
                        catch (e) {
                            hfc.common.log("xdatabound error with " + binding.path + " on " + this.element.tagName + " error: " + JSON.stringify(e));
                        }
                    };
                    return xdatabound;
                }(Binder));
                widget.xdatabound = xdatabound;
                var onEnter = (function (_super) {
                    __extends(onEnter, _super);
                    function onEnter(element, bindings, options) {
                        _super.call(this, element, bindings, options);
                    }
                    onEnter.prototype.init = function (element, bindings, options) {
                        var _this = this;
                        _super.prototype.init.call(this, element, bindings, options);
                        var binding = this.bindings["onEnter"];
                        $(element.input).bind("keydown", function (e) {
                            if (e.which === 13) {
                                var fn = binding.source.get(binding.path);
                                if (fn)
                                    fn(e, _this, binding.source);
                            }
                        });
                    };
                    onEnter.prototype.refresh = function () {
                    };
                    return onEnter;
                }(Binder));
                widget.onEnter = onEnter;
                var onKeyUp = (function (_super) {
                    __extends(onKeyUp, _super);
                    function onKeyUp(element, bindings, options) {
                        _super.call(this, element, bindings, options);
                    }
                    onKeyUp.prototype.init = function (element, bindings, options) {
                        var _this = this;
                        _super.prototype.init.call(this, element, bindings, options);
                        var binding = this.bindings["onKeyUp"];
                        $(element.element[0]).bind("keyup", function (e) {
                            var fn = binding.source.get(binding.path);
                            if (fn)
                                fn(e, _this, binding.source);
                        });
                    };
                    onKeyUp.prototype.refresh = function () {
                    };
                    return onKeyUp;
                }(Binder));
                widget.onKeyUp = onKeyUp;
                var onComboKeyUp = (function (_super) {
                    __extends(onComboKeyUp, _super);
                    function onComboKeyUp(element, bindings, options) {
                        _super.call(this, element, bindings, options);
                    }
                    onComboKeyUp.prototype.init = function (element, bindings, options) {
                        var _this = this;
                        _super.prototype.init.call(this, element, bindings, options);
                        var binding = this.bindings["onComboKeyUp"];
                        $(element.input[0]).bind("keyup", function (e) {
                            var fn = binding.source.get(binding.path);
                            if (fn)
                                fn(e, _this, binding.source);
                        });
                    };
                    onComboKeyUp.prototype.refresh = function () {
                    };
                    return onComboKeyUp;
                }(Binder));
                widget.onComboKeyUp = onComboKeyUp;
            })(widget = binders.widget || (binders.widget = {}));
        })(binders = data.binders || (data.binders = {}));
    })(data = kendo.data || (kendo.data = {}));
})(kendo || (kendo = {}));
//kendo.data.binders.widget.onEnter = kendo.data.binders.widget.onEnter || kendo.data.Binder.extend({
//	init: function(element, bindings, options) {
//		kendo.data.Binder.fn.init.call(this, element, bindings, options);
//		var binding = this.bindings.onEnter;
//		$(element.input).bind("keydown", function(e) {
//			if (e.which == 13) {
//				var fn = binding.source.get(binding.path);
//				if (fn) fn(e, this, binding.source);
//			}
//		});
//	},
//	refresh: () => { }
//});
//kendo.data.binders.widget.onKeyUp = kendo.data.binders.widget.onKeyUp || kendo.data.Binder.extend({
//	init: function(element, bindings, options) {
//		kendo.data.Binder.fn.init.call(this, element, bindings, options);
//		var binding = this.bindings.onKeyUp;
//		$(element.element[0]).bind("keyup", function(e) {
//			var fn = binding.source.get(binding.path);
//			if (fn) fn(e, this, binding.source);
//		});
//	},
//	refresh: () => { }
//});
// Combo boxes have an internal input element where the user input goes
//kendo.data.binders.widget.onComboKeyUp = kendo.data.binders.widget.onComboKeyUp || kendo.data.Binder.extend({
//	init: function(element, bindings, options) {
//		kendo.data.Binder.fn.init.call(this, element, bindings, options);
//		var binding = this.bindings.onComboKeyUp;
//		$(element.input[0]).bind("keyup", function(e) {
//			var fn = binding.source.get(binding.path);
//			if (fn) fn(e, this, binding.source);
//		});
//	},
//	refresh: () => { }
//});
var kendo;
(function (kendo) {
    var data;
    (function (data_1) {
        var binders;
        (function (binders) {
            var centerType = (function (_super) {
                __extends(centerType, _super);
                function centerType() {
                    _super.apply(this, arguments);
                }
                centerType.prototype.refresh = function () {
                    var that = this;
                    var ctid = that.bindings["centerType"].get() || "DONATE";
                    var ctrtype = hfc.common.CenterTypes.filter(function (c) {
                        return c.id === ctid;
                    })[0];
                    $(that.element).text(ctrtype.name);
                };
                return centerType;
            }(data_1.Binder));
            binders.centerType = centerType;
            var isChecked = (function (_super) {
                __extends(isChecked, _super);
                function isChecked() {
                    _super.apply(this, arguments);
                }
                isChecked.prototype.refresh = function () {
                    var that = this;
                    var value = that.bindings["isChecked"].get();
                    var isChecked = /^true$|^1$/i.test(value);
                    $(that.element).prop("checked", isChecked ? "checked" : "");
                };
                return isChecked;
            }(data_1.Binder));
            binders.isChecked = isChecked;
            var tileColor = (function (_super) {
                __extends(tileColor, _super);
                function tileColor() {
                    _super.apply(this, arguments);
                }
                tileColor.prototype.refresh = function () {
                    var _this = this;
                    var that = this;
                    var action = that.bindings["tileColor"].get();
                    ["add", "remove", "nochange"].forEach(function (a) { $(_this.element).toggleClass(a, false); });
                    $(that.element).toggleClass(action, true);
                };
                return tileColor;
            }(data_1.Binder));
            binders.tileColor = tileColor;
            var title = (function (_super) {
                __extends(title, _super);
                function title() {
                    _super.apply(this, arguments);
                }
                title.prototype.refresh = function () {
                    var that = this;
                    var value = that.bindings["title"].get();
                    $(that.element).attr("title", value);
                };
                return title;
            }(data_1.Binder));
            binders.title = title;
            var databoundX = (function (_super) {
                __extends(databoundX, _super);
                function databoundX() {
                    _super.apply(this, arguments);
                }
                databoundX.prototype.refresh = function () {
                    var binding = this.bindings["databound"];
                    try {
                        // common.log("databound: on " + this.element.tagName + " with " + binding.path);
                        // var fn = that.bindings["databound"].get();	// calls the function! don't want that
                        var fn = binding.source.get(binding.path);
                        if (!fn)
                            fn = eval(binding.path); // see if we can get a function reference by an eval
                        if (!fn)
                            fn = window[binding.path]; // see if we can get a function reference within the global window object
                        if (fn)
                            fn(this.element, binding.source);
                        else {
                            hfc.common.log("databound error: function doesn't exist: on " + this.element.tagName + " with " + binding.path + " on source " + JSON.stringify(binding.source));
                        }
                    }
                    catch (e) {
                        hfc.common.log("databound error with " + binding.path + " on " + this.element.tagName + " error: " + JSON.stringify(e));
                    }
                };
                return databoundX;
            }(data_1.Binder));
            binders.databoundX = databoundX;
            // get the count of a collection named in the binding
            var subcount = (function (_super) {
                __extends(subcount, _super);
                function subcount() {
                    _super.apply(this, arguments);
                }
                subcount.prototype.refresh = function () {
                    var that = this;
                    var binding = this.bindings["subcount"];
                    var collection = binding.source[binding.path];
                    var len = (collection === undefined || collection === null) ? 0 : collection.length;
                    $(that.element).text(len);
                };
                return subcount;
            }(data_1.Binder));
            binders.subcount = subcount;
            // join the properties of a collection
            var combine = (function (_super) {
                __extends(combine, _super);
                function combine() {
                    _super.apply(this, arguments);
                }
                combine.prototype.refresh = function () {
                    var element = $(this.element);
                    var binding = this.bindings["combine"];
                    var collection = binding.source[binding.path];
                    if (collection === undefined || collection === null) {
                        // try to walk the . notation of the path
                        var matches = /([^\.]+)\.(.*)/.exec(binding.path);
                        collection = binding.source[matches[1]][matches[2]];
                    }
                    if (collection === undefined || collection === null) {
                        element.text("");
                    }
                    else {
                        element.text(collection.join("\n"));
                        element.one("change", { element: element, collection: collection }, function (e) {
                            var txt = e.data.element.val();
                            if (txt !== "") {
                                // process the back-path to update the viewmodel from the element
                                e.data.collection.splice(0, e.data.collection.length); // empty the current collection
                                txt.split(/\s?[;\n]\s?/).forEach(function (v) { return e.data.collection.push(v); });
                            }
                        });
                    }
                };
                return combine;
            }(data_1.Binder));
            binders.combine = combine;
            // join the properties of a collection
            var top10 = (function (_super) {
                __extends(top10, _super);
                function top10() {
                    _super.apply(this, arguments);
                }
                top10.prototype.refresh = function () {
                    var binding = this.bindings["top10"];
                    var collection = binding.source[binding.path['coll']];
                    if (collection === undefined || collection === null) {
                        // try to walk the . notation of the path
                        var matches = /([^\.]+)\.(.*)/.exec(binding.path['coll']);
                        collection = binding.source[matches[1]][matches[2]];
                    }
                    if (collection === undefined || collection === null) {
                        $(this.element).text("");
                    }
                    else {
                        var prop_1 = binding.path["prop"].replace(/'/g, "");
                        var all = collection.slice(0, 10).map(function (v) {
                            return "<li>" + v[prop_1] + "</li>";
                        });
                        //var sep = binding.path["sep"].replace(/'/g, "");
                        $(this.element).html("<ol>" + all.join("") + "</ol>");
                    }
                };
                return top10;
            }(data_1.Binder));
            binders.top10 = top10;
            // apply animation to the element on appearance
            var appearAnimation = (function (_super) {
                __extends(appearAnimation, _super);
                function appearAnimation() {
                    _super.apply(this, arguments);
                }
                appearAnimation.prototype.refresh = function () {
                    var that = this;
                    var binding = this.bindings["appearAnimation"];
                    var type = binding.path;
                    //common.log("appearAnimation: " + type);
                    var random = [
                        "expandHorizontal",
                        "slideLeft",
                        "slideRight",
                        "slideUp",
                        "slideDown",
                        "zoomIn"
                    ];
                    var slides = [
                        "slideLeft",
                        "slideRight",
                        "slideUp",
                        "slideDown"
                    ];
                    if (type === "random")
                        type = random[Math.floor(Math.random() * random.length)];
                    else if (type === "slides")
                        type = slides[Math.floor(Math.random() * slides.length)];
                    // common.log("performing animation: " + type + " of " + binding.path);
                    var wrapper = kendo.fx($(that.element));
                    var effect = wrapper.fade("in");
                    switch (type) {
                        //case "fadeIn":
                        //effect = wrapper.fade( "in" );
                        //	break;
                        case "fadeOut":
                            effect = wrapper.fade("out");
                            break;
                        case "expandHorizontal":
                            effect.add(wrapper.expand("horizontal"));
                            break;
                        case "expandVertical":
                            effect.add(wrapper.expand("vertical"));
                            break;
                        case "slideLeft":
                            effect.add(wrapper.slideIn("left"));
                            break;
                        case "slideRight":
                            effect.add(wrapper.slideIn("right"));
                            break;
                        case "slideUp":
                            effect.add(wrapper.slideIn("up"));
                            break;
                        case "slideDown":
                            effect.add(wrapper.slideIn("down"));
                            break;
                        case "zoomIn":
                            effect.add(wrapper.zoom("in"));
                            break;
                        case "zoomOut":
                            effect.add(wrapper.zoom("out"));
                            break;
                    }
                    effect.duration(1000).play();
                };
                return appearAnimation;
            }(data_1.Binder));
            binders.appearAnimation = appearAnimation;
            // Example: <span data-bind="formattedText: selectedBlock.LastUpdated" data-format="dddd MMM dd, yyyy hh:mmtt"></span>
            var formattedText = (function (_super) {
                __extends(formattedText, _super);
                function formattedText(element, bindings, options) {
                    _super.call(this, element, bindings, options);
                    this.format = String($(element).data("format"));
                }
                formattedText.prototype.refresh = function () {
                    var data = this.bindings["formattedText"].get();
                    if (data) {
                        $(this.element).text(kendo.toString(data, this.format));
                    }
                };
                return formattedText;
            }(data_1.Binder));
            binders.formattedText = formattedText;
            // Example: <span data-bind="date: selectedBlock.LastUpdated" data-dateformat="dddd MMM dd, yyyy hh:mmtt"></span>
            var date = (function (_super) {
                __extends(date, _super);
                function date(element, bindings, options) {
                    _super.call(this, element, bindings, options);
                    this.dateformat = String($(element).data("dateformat"));
                }
                date.prototype.refresh = function () {
                    var data = this.bindings["date"].get();
                    if (data) {
                        var dateObj = new Date(data);
                        $(this.element).text(kendo.toString(dateObj, this.dateformat));
                    }
                };
                return date;
            }(data_1.Binder));
            binders.date = date;
            // format text from binding
            //export class textFormat extends Binder {
            //    f: string;
            //    m: number;
            //    n: string;
            //    init(element, bindings, options) {
            //        kendo.data.Binder.fn.init.call(this, element, bindings, options);
            //        var t = $(element);
            //        this.f = t.data("format");
            //        this.m = parseInt(t.data("trim"));
            //        this.n = t.data("none");
            //    }
            //    refresh() {
            //        var t = $(this.element),
            //            v: string = this.bindings["textFormat"].get(),
            //            w: number = this.m;
            //        if (this.n !== undefined && (v === undefined || v === null)) {
            //            t.html(this.n);
            //        } else {
            //            var x:string = kendo.toString(v, this.f);
            //            if (w !== undefined && x.length > w) {
            //                x = x.substr(0, w) + "...";
            //            }
            //            t.html(x);
            //        }
            //    }
            //}
            //kendo.data.binders.textFormat = kendo.data.binders.textFormat || kendo.data.Binder.extend({
            //	init: function(element, bindings, options) {
            //		kendo.data.Binder.fn.init.call(this, element, bindings, options);
            //		var t = $(element);
            //		this.f = t.data("format");
            //		this.m = t.data("trim");
            //		this.n = t.data("none");
            //	},
            //	refresh: function() {
            //		var t = $(this.element),
            //			v = this.bindings.textFormat.get(),
            //			w = this.m;
            //		if (this.n !== undefined && (v === undefined || v === null)) {
            //			t.html(this.n);
            //		} else {
            //			var x = kendo.toString(v, this.f);
            //			if (w !== undefined && x.length > w) {
            //				x = x.substr(0, w) + "...";
            //			}
            //			t.html(x);
            //		}
            //	}
            //});
            // toggle a CSS class
            // <div class="tile" data-bind="cssToggle: canRemove" data-class-true="already" data-class-false="new">
            var cssToggle = (function (_super) {
                __extends(cssToggle, _super);
                function cssToggle(element, bindings, options) {
                    _super.call(this, element, bindings, options);
                    var t = $(element);
                    this.c = String(t.data("class") || t.data("classTrue") || "enabled");
                    this.nc = String(t.data("class") || t.data("classFalse") || "disabled");
                }
                cssToggle.prototype.refresh = function () {
                    var e = $(this.element);
                    var binding = this.bindings["cssToggle"];
                    var val = binding.source[binding.path];
                    // var val = binding.get();
                    if (val) {
                        e.addClass(this.c);
                    }
                    else {
                        e.removeClass(this.c);
                        if (this.c !== this.nc) {
                            e.addClass(this.nc);
                        }
                    }
                };
                return cssToggle;
            }(data_1.Binder));
            binders.cssToggle = cssToggle;
        })(binders = data_1.binders || (data_1.binders = {}));
    })(data = kendo.data || (kendo.data = {}));
})(kendo || (kendo = {}));
//# sourceMappingURL=common.js.map