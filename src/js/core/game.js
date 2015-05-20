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
// GAME

var game = Tile.Engine.create({
	options: {
		debug: true,
		draw: true
	},
	width: 960,
	height: 576,
	tilesize: 48,
	utils: utils,
	ui: ui,
	types: types,
	sprites: sprites,
	actions: actions,
	world: {
		width: 100,
		height: 50
	},
	init: {
		init_sync_player: function() {
			game.world().everywhere(function(x, y, process){
				var tile = game.world().tiles(0)[x][y];
				if (!game.world().player() && tile.type() === 'town') {
					game.world().player(Tile.Obj.create({
						properties : game.world().type('player')
					}));
					game.world().player().properties().town = tile;
					game.camera({
						x : x,
						y : y
					});
				}
			}, 1, function() {
				// done
			});
		}
	}
});

game.run();

// END GAME
// --------------------------------------------------
