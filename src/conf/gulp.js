// --------------------------------------------------
// LICENSE

/*
	This file is part of Tile.

	Tile is a 2D JavaScript tile engine for the HTML5 canvas
	Copyright (C) 2015 Aaron John Schlosser

	Tile is free software; you can redistribute it and/or
	modify it under the terms of the GNU General Public License
	as published by the Free Software Foundation; either version 2
	of the License, or (at your option) any later version.

	Tile is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program; if not, write to the Free Software
	Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/

// END LICENSE
// --------------------------------------------------

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
		"src": "src/js/**/*.js",
		"dist": "dist",
		"sources": [
			"src/js/engine/Tile.js",
			"src/js/core/ui.js",
			"src/js/core/sprites.js",
			"src/js/core/types.js",
			"src/js/core/actions.js",
			"src/js/core/utils.js",
			"src/js/core/game.js"
		],
		"name": "game.js"
	},
	"vendors": {
		"src": "src/bower_components",
		"dist": "dist/vendors",
		"sources": [],
		"maps": []
	}
};