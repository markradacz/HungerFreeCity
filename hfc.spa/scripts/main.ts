/// <reference path='typings/jquery/jquery.d.ts' />
/// <reference path='typings/kendo-ui/kendo-ui.d.ts' />
/// <reference path='typings/firebase/firebase.d.ts' />
/// <reference path='typings/require.d.ts' />
/// <reference path='common.ts' />

require.config({
	paths: {
		'jQuery': '//code.jquery.com/jquery-1.9.1.min', // 2.2.3
		'kendo': "//kendo.cdn.telerik.com/2015.3.930/js/kendo.all.min",
		//'kendo': '//kendo.cdn.telerik.com/2016.1.412/js/kendo.all.min',
		'bootstrap': '//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min',
		'firebase': '//cdn.firebase.com/js/client/2.4.2/firebase',
		'pubsub': 'pubsub',
		'async': 'async',
		'text': 'text',
		'common': 'common',
		'liveSetup': 'liveSetup',
        'live': 'live',
		'app': 'app'
	},
	shim: {
		'kendo': {
			deps: ['jQuery'],
			exports: 'kendo'
		},
		'pubsub': {
			deps: ['jQuery']
		},
		'bootstrap': {
			deps: ['jQuery']
		},
        'common': {
            deps: ['jQuery', 'kendo', 'firebase'],
			exports: 'common'
        },
		'live': {
			deps: ['liveSetup']
		},
		'app': {
            deps: ['jQuery', 'kendo', 'firebase', 'pubsub', 'common', 'bootstrap', 'text', 'async', 'live'],
			exports: 'app'
        }
    },
	waitSeconds: 0
} );

define([
    'app'
], app => {
	app.start();
});

// Stop Form Submission of Enter Key Press
function stopRKey( evt ) {
	var evt2 = ( evt ) ? evt : ( ( event ) ? event : null );
	var node = ( evt.target ) ? evt2.target : ( ( evt2.srcElement ) ? evt2.srcElement : null );
	if( ( evt.keyCode === 13 ) && ( node.type === 'text' ) ) { return false; }
	return true;
}
window.document.onkeypress = stopRKey;
