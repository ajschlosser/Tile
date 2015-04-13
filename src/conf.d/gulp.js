module.exports = {
	"templates": {
		"src": "src/templates/**/*.html",
		"dist": "dist"
	},
	"styles": {
		"src": "src/styles/**/*.less",
		"dist": "dist/styles",
		"name": "styles.css"
	},
	"scripts": {
		"src": "src/scripts/**/*.js",
		"dist": "dist",
		"sources": [
			"src/scripts/engine.js",
			"src/scripts/sprites.js",
			"src/scripts/events.js",
			"src/scripts/actions.js",
			"src/scripts/utils.js",
			"src/scripts/game.js"
		],
		"name": "game.js"
	},
	"vendors": {
		"src": "src/bower_components",
		"dist": "dist/vendors",
		"sources": [],
		"maps": []
	}
}