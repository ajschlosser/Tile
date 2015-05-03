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
// UTILS

var utils = {
	getRandomNeighborOf: function(obj) {
		var n1 = Math.random() * 2 > 1 ? 1 : -1,
			n2 = Math.random() * 2 > 1 ? 1 : -1,
			m1 = Math.random() * 2 > 1 ? 0 : 1,
			m2 = Math.random() * 2 > 1 ? 0 : 1,
			x = obj.x() + n1*m1,
			y = obj.y() + n2*m2,
			z = obj.z() || 0,
			o = game.world().tile(x,y,z);
		if (o) {
			return o;
		}
	},
	hasNeighborOfType: Tile.Obj.hasNeighborOfType,
	capitalizeFirstLetter: function(s) {
		return s.charAt(0).toUpperCase() + s.substr(1, s.length);
	}
};

// END UTILS
// --------------------------------------------------
