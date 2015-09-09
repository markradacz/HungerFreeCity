define( [], function () {
	if( document.location.hostname === "localhost" ) {
		window.AdditionalLinks = [
			"index.html",
			"Views/home/home.html",
			"Views/home/home.js",
			"Views/manage/manage.html",
			"Views/manage/manage.js",
			"Views/needs/needs.html",
			"Views/needs/needs.js",
			"Views/location/location.html",
			"Views/location/location.js",
			"Views/center/center.html",
			"Views/center/center.js"
		];
	}
	return null;
} );