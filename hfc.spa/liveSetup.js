define( [], function () {
	if( document.location.hostname == "localhost" ) {
		window.AdditionalLinks = [
			"Views/layout/layout.html",
			"Views/layout/layout.js",
			"Views/manage/manage.html",
			"Views/manage/manage.js",
			"Views/manage/needs.html",
			"Views/manage/needs.js",
			"Views/manage/location.html",
			"Views/manage/location.js",
			"Views/manage/center.html",
			"Views/manage/center.js"
		];
	}
	return null;
} );