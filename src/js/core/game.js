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
	options: { draw: true },
	width: 960,
	height: 540,
	tilesize: 32,
	utils: utils,
	ui: ui,
	types: types,
	sprites: sprites,
	actions: actions,
	world: {
		width: 35,
		height: 25
	}
});

game.run();

// END GAME
// --------------------------------------------------
