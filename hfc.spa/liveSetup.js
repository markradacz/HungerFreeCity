define( [], function () {
	if( document.location.hostname == "localhost" ) {
		window.AdditionalLinks = [
			"Views/layout/layout.html",
			"Views/layout/layout.js",
			"Views/home/home.html",
			"Views/home/home.js"
		];
	}
	return null;
} );