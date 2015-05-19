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
// OBJ

Tile.Obj = {
	hasNeighborOfType: function(obj, type, range) {
		range = range || 1;
		var count = 0;
		for (var x = obj.x() - range; x <= obj.x() + range; x++) {
			for (var y = obj.y() - range; y <= obj.y() + range; y++) {
				var o = game.world().tile(x,y,obj.z() || 0);
				if (o && o.type() === type) {
					count++;
				}
			}
		}
		return count;
	},
	create: function(params) {
		params = params || {};
		var x = params.x,
			y = params.y,
			z = params.z || 0,
			height = params.height || 0,
			depth = params.depth || 0,
			type = params.type,
			visible = (params.visible === true || params.visible === false) ? params.visible : true,
			properties = $.clone($.extend({}, params.properties || {}), true);
		return {
			visible: function(b) {
				if (typeof b === 'boolean') {
					visible = b;
				} else {
					return visible;
				}
			},
			x: function(n) {
				if (Number.isInteger(n)) {
					x = n;
				} else {
					return x;
				}
			},
			y: function(n) {
				if (Number.isInteger(n)) {
					y = n;
				} else {
					return y;
				}
			},
			z: function(n) {
				if (Number.isInteger(n)) {
					z = n;
				} else {
					return z;
				}
			},
			height: function(n) {
				if (Number.isInteger(n)) {
					height = n;
				} else {
					return height;
				}
			},
			depth: function(n) {
				if (Number.isInteger(n) && n < 7) {
					depth = n;
				} else {
					return depth;
				}
			},
			properties: function(props) {
				if (!props || typeof props !== 'object') {
					return properties;
				} else {
					properties = props;
				}
			},
			type: function(t) {
				if (typeof t === 'string') {
					type = t;
				} else {
					return type;
				}
			}
		};
	}
};

// END OBJ
// --------------------------------------------------
