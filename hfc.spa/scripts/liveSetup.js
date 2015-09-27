define( [], function () {
	if( document.location.hostname === "localhost" ) {
		window.AdditionalLinks = [
			"index.html",
			"scripts/app.js",
			"scripts/common.js",
			"Views/home/home.html",
			"Views/home/home.js",
			"Views/favorites/favorites.html",
			"Views/favorites/favorites.js",
			"Views/map/map.html",
			"Views/map/map.js",
			"Views/all/all.html",
			"Views/all/all.js",
			"Views/manage/manage.html",
			"Views/manage/manage.js",
			"Views/needs/needs.html",
			"Views/needs/needs.js",
			"Views/location/location.html",
			"Views/location/location.js",
			"Views/center/center.html",
			"Views/center/center.js",
			"Views/admin/admin.html",
			"Views/admin/admin.js",
			"Views/users/users.html",
			"Views/users/users.js"
		];
	}
	return null;
} );