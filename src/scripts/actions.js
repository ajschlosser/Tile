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
// ACTIONS

var actions = [
	{
		name: 'wetten',
		action: function(obj){
			if (obj.properties().wetness >= 4) {
				obj.type('water');
				obj.properties().flows = true;
			}
		}	
	},
	{
		name: 'flood',
		action: function(obj){
			var neighbor = game.utils().getRandomNeighborOf(obj);
			if (neighbor && obj.properties().flows && obj.height() >= neighbor.height() ) {
				if (neighbor.properties().wetness < 4) {
					neighbor.properties().wetness += 1;
				}
			}
		}
	},
	{
		name: 'deepen',
		events: [{
			type: 'mousemove',
			conditions: {
				ctrl: true
			}
		}],
		action: function(obj){
			var height = obj.height();
			obj.height(height-1);
			obj.depth(3);
		}	
	},
	{
		name: 'grow',
		action: function(obj){
			var r = Math.random() * 10000;
			if (obj.properties().growth && r > 9950) {
				var g = Math.floor(Math.random() * 9),
					farms = game.utils().hasNeighborOfType(obj, 'farm', 3) * 25 || 1;
				obj.properties()[obj.properties().growth[0]] += g * farms;
			}
		}	
	},
	{
		name: 'info',
		events: [{
			type: 'click',
			conditions: {
				shift: true
			}
		}],
		action: function(obj){
			var name = obj.type();
			ui.dialog.title(game.utils().capitalizeFirstLetter(name));
			var content = 'This ' + name + ' has a height of ' + obj.height() + ', a depth of ' + obj.depth() + '. ';
			Tile.tools.keys(obj.properties()).forEach(function(prop){
				if (!Array.isArray(obj.properties()[prop]) && typeof obj.properties()[prop] !== 'object') {
					content += 'It has a ' + prop + ' of ' + obj.properties()[prop] + '. ';
				}
			});
			console.log(game.utils().hasNeighborOfType(obj,'farm',3));
			ui.dialog.content(content);
			ui.dialog.show();
		}
	},
	{
		name: 'move',
		events: ['click'],
		action: function(obj){
			game.camera({
				x: obj.x(),
				y: obj.y()
			});
		}
	}
];

// END ACTIONS
// --------------------------------------------------
