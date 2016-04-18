/// <reference path="typings/jquery/jquery.d.ts" />
/// <reference path="typings/kendo-ui/kendo-ui.d.ts" />
/// <reference path="typings/firebase/firebase.d.ts" />
/// <reference path="typings/require.d.ts" />
/// <reference path="common.ts" />

require.config({
	paths: {
		'jQuery': "https://code.jquery.com/jquery-2.1.4.min",
		'bootstrap': "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min",
		'kendo': "https://kendo.cdn.telerik.com/2016.1.412/js/kendo.all.min",
		'firebase': "https://cdn.firebase.com/js/client/2.3.0/firebase",
		'pubsub': "pubsub",
		'async': "async",
		'text': "text",
		'common': "common",
		'liveSetup': "liveSetup",
        'live': "live",
		'app': "app"
	},
	shim: {
		'kendo': {
			deps: ["jQuery"]
		},
		'pubsub': {
			deps: ["jQuery"]
		},
		'bootstrap': {
			deps: ["jQuery"]
		},
		'live': {
			deps: ["liveSetup"]
		},
        'common': {
            deps: ["jQuery", "kendo"]
        },
		'app': {
            deps: ["jQuery", "kendo", "common", "pubsub", "bootstrap", "firebase", "text", "async", "live"]
        }
    },
	waitSeconds: 0
} );

define( [
    "app"
], app => {
	app.start();
});

// Stop Form Submission of Enter Key Press
function stopRKey( evt ) {
	var evt2 = ( evt ) ? evt : ( ( event ) ? event : null );
	var node = ( evt.target ) ? evt2.target : ( ( evt2.srcElement ) ? evt2.srcElement : null );
	if( ( evt.keyCode === 13 ) && ( node.type === "text" ) ) { return false; }
	return true;
}
window.document.onkeypress = stopRKey;
