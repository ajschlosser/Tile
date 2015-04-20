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
	"assets": {
		"dist": "dist/assets",
		"sources": [
			"src/fonts/**/*",
			"src/art/**/*.png"
		]
	},
	"scripts": {
		"src": "src/scripts/**/*.js",
		"dist": "dist",
		"sources": [
			"src/scripts/engine.js",
			"src/scripts/ui.js",
			"src/scripts/sprites.js",
			"src/scripts/types.js",
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