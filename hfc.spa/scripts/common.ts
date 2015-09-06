/// <reference path="typings/jquery.d.ts" />
/// <reference path="typings/kendo.all.d.ts" />
/*global alert,$,self,models,data,document,window,kendo,jQuery*/
module hfc {
    export class common extends kendo.data.ObservableObject {
        /*-----------------------------------------------------
		User
	    -----------------------------------------------------*/
        public static User: any = null;

        public static FirebaseUrl: string = 'https://amber-torch-2255.firebaseio.com/';

        /*-----------------------------------------------------
		Toast Notifications
	    -----------------------------------------------------*/
        public static successToast(message: string): void  {
            var w : kendo.ui.Notification = $("#notification").data("kendoNotification");
            if(w) w.show({ message: message }, "success");
        }

        public static infoToast(message: string): void  {
            var w: kendo.ui.Notification = $("#notification").data("kendoNotification");
            if (w) w.show({ message: message }, "info");
        }

        public static warningToast(message: string): void  {
            var w: kendo.ui.Notification = $("#notification").data("kendoNotification");
            if (w) w.show({ message: message }, "warning");
        }

        public static errorToast(message: string): void  {
            var w: kendo.ui.Notification = $("#notification").data("kendoNotification");
            if (w) w.show({ message: message }, "error");
        }

        /*-----------------------------------------------------
		Debug Logging
	    -----------------------------------------------------*/
        private static _getTimeDiff() : number { return new Date().getTime() - performance.timing.navigationStart; }

        public static log(message: string): void  {
            if (window.console) {
                console.log(this._getTimeDiff() + "ms: " + message);
                // if (console.timeStamp) console.timeStamp(message);
            }
        }
    }
}

// extend jQuery with a new distinctByProperty() function that does an in-place edit of the array removing duplicates; favoring early values rather than latter
jQuery.extend({
    distinctByProperty: (obj: Array<any>, propertyName: string) => {
	    $.each(obj, (i, v) => {
	        if (v === undefined || v === null) return;	// may encounter missing items if they were sliced away below
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
    replaceOrAddItem: (array: Array<any>, keyPropertyName: string, keyValue: any, replacementItem: any) => {
	    // common.log("replaceOrAddItem: " + array.length + " of " + keyPropertyName + " = " + keyValue + " with " + JSON.stringify(replacementItem));
	    // slice(0) used here to copy the array to avoid sequence bugs since we remove items in-place
	    if (array.length > 0) {
	        $.each(array.slice(0), (i, v) => {
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
    sortItems: (array: Array<any>, keyPropertyName: string) => {
	    // common.log("replaceOrAddItem: " + array.length + " of " + keyPropertyName + " = " + keyValue + " with " + JSON.stringify(replacementItem));
	    // slice(0) used here to copy the array
	    var copy = array.slice(0);
	    copy.sort((a, b) => {
	        var a1 = a[keyPropertyName], b1= b[keyPropertyName];
	        if(a1 === b1) return 0;
	        return a1 > b1 ? 1 : -1;
	    });

	    // empty the original array and set the new values
	    array.splice(0, array.length);

	    // add the items back in the sorted order
	    $.each(copy, (i, v) => { array.push(v); });
	}
});

// extend the DataSource to add a custom updateField function
// updateField takes a JSON object with 4 attributes, keyField, keyValue, updateField and updateValue.
// for example: to update the Age field, do this ds.updateField({ keyField: 'Id', keyValue: 'jaaron', updateField: 'Age', updateValue: 55 });
jQuery.extend(true, kendo.data.DataSource.prototype, {
	updateField: function(e) {
		var ds = this;
		$.each(ds._data, (idx, record) => {
		    if(record[e.keyField] === e.keyValue) {
		        this._data[idx][e.updateField]= e.updateValue;
		        this.read(this._data);
		    }
		});
		return false;
	}
});

// this adds 'placeholder' to the items listed in the jQuery .support object
jQuery(() => {
    jQuery.support["placeholder"] = false;
    var test = document.createElement("input");
    if ("placeholder" in test) jQuery.support["placeholder"] = true;
});

// This adds placeholder support to browsers that wouldn't otherwise support it
jQuery(() => {
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
        $("form:eq(0)").submit(() => { $(":text.k-readonly").val(""); });
    }
});

module kendo.data.binders.widget {
    export class onEnter extends Binder {
        constructor(element: Element, bindings: { [key: string]: Binding; }, options?: any) {
            super(element, bindings, options);
        }

        init(element: any, bindings: { [key: string]: Binding; }, options?: any) {
 		    data.Binder.fn.init.call(this, element, bindings, options);
		    var binding = this.bindings["onEnter"];
		    $(element.input).bind("keydown", function(e) {
			    if (e.which === 13) {
				    var fn = binding.source.get(binding.path);
				    if (fn) fn(e, this, binding.source);
			    }
		    });
       }

        refresh() {          
        }
    }

    export class onKeyUp extends Binder {
        constructor(element: Element, bindings: { [key: string]: Binding; }, options?: any) {
            super(element, bindings, options);
        }

        init(element: any, bindings: { [key: string]: Binding; }, options?: any) {
            data.Binder.fn.init.call(this, element, bindings, options);
            var binding = this.bindings["onKeyUp"];
            $(element.element[0]).bind("keyup", function (e) {
                var fn = binding.source.get(binding.path);
                if (fn) fn(e, this, binding.source);
            });
        }

        refresh() {
        }
    }

    export class onComboKeyUp extends Binder {
        constructor(element: Element, bindings: { [key: string]: Binding; }, options?: any) {
            super(element, bindings, options);
        }

        init(element: any, bindings: { [key: string]: Binding; }, options?: any) {
            data.Binder.fn.init.call(this, element, bindings, options);
            var binding = this.bindings["onComboKeyUp"];
            $(element.input[0]).bind("keyup", function (e) {
                var fn = binding.source.get(binding.path);
                if (fn) fn(e, this, binding.source);
            });
        }

        refresh() {
        }
    }
}

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

module kendo.data.binders {
    export class selected extends Binder {
        refresh() {
            var that = this;
            var value = that.bindings["isChecked"].get();
            var isChecked = /^true$|^1$/i.test(value);
            $(that.element).prop("checked", isChecked ? "checked" : "");
       }
    }
    export class isChecked extends Binder {
        refresh() {
            var that = this;
            var value = that.bindings["isChecked"].get();
            var isChecked = /^true$|^1$/i.test(value);
            $(that.element).prop("checked", isChecked ? "checked" : "");
        }
    }
    export class tileColor extends Binder {
        refresh() {
            var that = this;
            var action = that.bindings["tileColor"].get();
            ["add", "remove", "nochange"].forEach(a => { $(this.element).toggleClass(a, false); });
            $(that.element).toggleClass(action, true);
        }
    }
    export class title extends Binder {
        refresh() {
            var that = this;
            var value = that.bindings["title"].get();
            $(that.element).attr("title", value);
        }
    }
    export class databound extends Binder {
        refresh() {
            var binding = this.bindings["databound"];
            try {
                // common.log("databound: on " + this.element.tagName + " with " + binding.path);
                // var fn = that.bindings["databound"].get();	// calls the function! don't want that
                var fn = binding.source.get(binding.path);
                if (!fn) fn = eval(binding.path);	// see if we can get a function reference by an eval
                if (!fn) fn = window[binding.path];	// see if we can get a function reference within the global window object
                if (fn) fn(this.element, binding.source);
                else {
                    hfc.common.log("databound error: function doesn't exist: on " + this.element.tagName + " with " + binding.path + " on source " + JSON.stringify(binding.source));
                }
            } catch (e) {
                hfc.common.log("databound error with " + binding.path + " on " + this.element.tagName + " error: " + JSON.stringify(e));
            }
        }
    }

    // get the count of a collection named in the binding
    export class subcount extends Binder {
        refresh() {
            var that = this;
            var binding = this.bindings["subcount"];
            var collection = binding.source[binding.path];
            var len = (collection === undefined || collection === null) ? 0 : collection.length;
            $(that.element).text(len);
        }
    }

    // apply animation to the element on appearance
    export class appearAnimation extends Binder {
        public refresh() : void {
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
        }
    }

    // Example: <span data-bind="formattedText: selectedBlock.LastUpdated" data-format="dddd MMM dd, yyyy hh:mmtt"></span>
    export class formattedText extends Binder {
        format: string;
        constructor(element: Element, bindings: { [key: string]: Binding; }, options?: any) {
            super(element, bindings, options);
            this.format = $(element).data("format");
        }
        refresh() {
            var data = this.bindings["formattedText"].get();
            if (data) {
                $(this.element).text(kendo.toString(data, this.format));
            }
        }
    }

// Example: <span data-bind="date: selectedBlock.LastUpdated" data-dateformat="dddd MMM dd, yyyy hh:mmtt"></span>
    export class date extends data.Binder {
        private dateformat: string;
        constructor(element: Element, bindings: { [key: string]: Binding; }, options?: any) {
            super(element, bindings, options);
            this.dateformat = $(element).data("dateformat");
        }
        public refresh() {
            var data = this.bindings["date"].get();
            if (data) {
                var dateObj = new Date(data);
                $(this.element).text(kendo.toString(dateObj, this.dateformat));
            }
        }
    }

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
    export class cssToggle extends Binder {
        c: string;
        nc: string;
        constructor(element: Element, bindings: { [key: string]: Binding; }, options?: any) {
            super(element, bindings, options);
            var t = $(element);
            this.c = t.data("class") || t.data("classTrue") || "enabled";
            this.nc = t.data("class") || t.data("classFalse") || "disabled";
        }
        refresh() {
            var e = $(this.element);
            var binding = this.bindings["cssToggle"];
            var val = binding.source[binding.path];
            // var val = binding.get();
            if (val) {
                e.addClass(this.c);
            } else {
                e.removeClass(this.c);
                if (this.c !== this.nc) {
                    e.addClass(this.nc);
                }
            }
        }
    }
}