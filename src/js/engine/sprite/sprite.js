//removeIf(production)
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
//endRemoveIf(production)

// --------------------------------------------------
// SPRITE

Tile.Sprite = {
	create: function(params) {
		var img = new Image(),
			type;
		(function set(params) {
			img.src = params.src;
			img.w = params.w;
			img.h = params.h;
			type = params.type;
		})(params);
		return {
			img: function(params, callback) {
				if (params === undefined) {
					return img;
				} else {
					set(params);
				}
				this.loaded(callback);
			},
			type: function(t) {
				if (typeof t === 'string') {
					type = t;
				} else {
					return type;
				}
			},
			loaded: function(callback) {
				img.addEventListener('load', function() {
					callback();
				});
			}
		};
	}
};

// END SPRITE
// --------------------------------------------------
