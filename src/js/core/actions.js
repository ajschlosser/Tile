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
			if (obj.type() !== 'water' && obj.properties().levels.water === 9) {
				game.world().transform(obj).to('water');
			}
		}	
	},
	{
		name: 'vegetate',
		action: function(obj){
			if (obj.properties().levels.grass < 9) {
				var r = Math.random()*10000;
				if (r > 9950) {
					obj.properties().levels.grass++;
				}
			}
			if (obj.properties().levels.grass >= 9) {
				game.world().transform(obj).to('grass');
			}
		}
	},
	{
		name: 'flood',
		action: function(obj){
			var neighbor = game.utils().getRandomNeighborOf(obj);
			if (neighbor && neighbor.type() !== obj.type() && obj.properties().flows && obj.depth() < neighbor.depth() ) {
				var water1 = obj.properties().levels[obj.type()],
					water2 = neighbor.properties().levels[obj.type()];
				if (water1 > water2 && water2 < 9) {
					neighbor.properties().levels[obj.type()] += 1;
				}
			}
		}
	},
	{
		name: 'deepen',
		events: [{
			type: 'mousemove',
			buttons: {
				ctrl: true
			}
		}],
		states: ['canDeepen'],
		action: function(obj){
			var depth = obj.depth();
			depth += 1;
			if (depth >= 9) {
				depth = 9;
			}
			obj.depth(depth);
			if (obj.type() === 'grass') {
				game.world().transform(obj).to('dirt');
			}
		}	
	},
	{
		name: 'grow',
		action: function(obj){
			var r = Math.random() * 10000;
			if (obj.properties().growth && r > 9990) {
				var g = Math.floor(Math.random() * 9),
					m = Math.round(obj.properties().population / 1000),
					farms = game.utils().hasNeighborOfType(obj, 'farm', 3) * 25 || 1;
				obj.properties()[obj.properties().growth[0]] += g * ((farms - m) > 0 ? (farms - m) : 0);
				if (obj.type() === 'town' && obj.properties()[obj.properties().growth[0]] > 10000) {
					game.world().transform(obj).to('city');
				}
			}
		}	
	},
	{
		name: 'info',
		events: [{
			type: 'click',
			buttons: {
				shift: true
			}
		}],
		action: function(obj){
			var name = obj.type();
			var title = game.utils().capitalizeFirstLetter(name) + '(' + obj.x() + ', ' + obj.y() + ')',
				content = 'This ' + name + ' has a height of ' + obj.height() + ', a depth of ' + obj.depth() + '. ';
			$.keys(obj.properties()).forEach(function(prop){
				if (!Array.isArray(obj.properties()[prop]) && typeof obj.properties()[prop] !== 'object') {
					content += 'It has a ' + prop + ' of ' + obj.properties()[prop] + '. ';
				} else if (!Array.isArray(obj.properties()[prop]) && typeof obj.properties()[prop] === 'object') {
					$.keys(obj.properties()[prop]).forEach(function(p){
						content += 'It has a ' + p + ' ' + prop + ' of ' + obj.properties()[prop][p] + '. ';
					});
				}
			});
			ui.modal.update(title, content);
			ui.modal.show();
		}
	},
	{
		name: 'move',
		events: ['click'],
		action: function(obj){
			var x = obj.x(),
				y = obj.y(),
				w = game.world().width(),
				h = game.world().height(),
				view = {
					width: Math.floor(game.view().width/2),
					height: Math.floor(game.view().height/2)
				};
			if (x + view.width > w) {
				x = w - view.width;
			}
			if (x - view.width < 0) {
				x = view.width;
			}
			if (y + view.height > h) {
				y = h - view.height -1;
			}
			if (y - view.height < 0) {
				y = view.height;
			}
			game.camera({
				x: x,
				y: y
			});
		}
	},
	{
		name: 'player',
		action: function() {
			ui.status.update('Citizens: ' + game.world().player().properties().town.properties().population);
		}
	}
];

// END ACTIONS
// --------------------------------------------------
