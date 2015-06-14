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
// WORLD

Tile.World = {
	create: function(params) {
		params = params || {};
		var width = params.width,
			height = params.height,
			total = width * height,
			properties = function(t) {
				t = params.types[t] ? t : '*';
				return $.cut($.extend($.clone(params.types[t]), $.clone(params.types['*'])), ['actions']);
			},
			tiles = {
				0: [],
				persistent: []
			},
			types = params.types,
			player = params.player || null;
		return  {
			width: function() {
				return width;
			},
			height: function() {
				return height;
			},
			total: function() {
				return total;
			},
			all: function() {
				var all = [];
				this.throughout(function(x, y){
					all.push([x, y]);
				});
				return all;
			},
			tile: function(x, y, z) {
				z = z || 0;
				if (tiles[z][x] && tiles[z][x][y]) {
					return tiles[z][x][y];
				}
			},
			tiles: function(z) {
				z = z || 0;
				return tiles[z];
			},
			type: function(t) {
				return types[t];
			},
			player: function(p) {
				if (p) {
					player = p;
				} else {
					return player;
				}
			},
			transform: function(tile) {
				return {
					to: function(type, props) {
						if (tile.properties().persistent) {
							$.find(tiles.persistent, [tile.x(), tile.y()], function(coords, i){
								tiles.persistent.splice(i, 1);
							});
						}
						props = props || $.clone(properties(type), true);
						tile.type(type);
						tile.properties(props);
					}
				};
			},
			put: function(tile) {
				tiles[tile.z()].push(tile);
			},
			throughout: function(fn) {
				for (var x = 0; x < width; x++) {
					for (var y = 0; y < height; y++) {
						fn(x, y);
					}
				}
			},
			randomly: function(fn, range) {
				var w = range.w,
					h = range.h,
					tiles = [];
				for (var x = range.x; x < w; x++) {
					for (var y = range.y; y < h; y++) {
						tiles.push([x, y]);
					}
				}
				while (tiles.length > 0) {
					var coords = $.tug(tiles);
					fn.call(this, coords[0], coords[1]);
				}
			},
			everywhere: function(fn, i, callback) {
				var self = this;
				if (Array.isArray(fn)) {
					fn = fn;
				} else {
					if (typeof fn === 'function') {
						fn = [fn];
					} else if ($.keys(fn).length) {
						fn = [];
						$.keys(fn).forEach(function(func){
							fn.push(func);
						});
					}
				}
				fn = Array.isArray(fn) ? fn : [fn];
				i = i || 1;
				var series = i * fn.length;
				function run(f){
					var all = self.all(),
						percent = 0;
					while (all.length > 0) {
						var remaining = Math.floor((all.length/total*100));
						if (100 - remaining !== percent) {
							percent = 100 - remaining;
						}
						var coords = $.tug(all);
						f.call(this, coords[0], coords[1], { percent: percent, index: i, remaining: all.length });
					}
					series--;
				}
				while (i--) {
					fn.forEach(run);
				}
				var finished = setInterval(function(){
					if (series <= 0) {
						callback();
						clearInterval(finished);
					}
				});
			},
			generate: function(callback) {
				var self = this;
				for (var x = 0; x < width; x++) {
					tiles[0][x] = [];
					for (var y = 0; y < height; y++) {
						var r = Math.random()*1000,
							type;
						if (r < 850) {
							type = 'grass';
						} if (r >= 850) {
							type = 'meadow';
						} if (r >= 900) {
							type = 'farm';
						} if (r >= 950) {
							type = 'water';
						} if (r > 995) {
							type = 'town';
						}
						var tile = Tile.Obj.create({
							x : x,
							y : y,
							type : type,
							height : 7,
							depth : type === 'water' ? 2 : 0,
							properties : properties(type)
						});
						if (tile.properties().persistent) {
							tiles.persistent.push([tile.x(), tile.y()]);
						}
						tiles[0][x][y] = tile;
					}
				}
				var status;
				self.everywhere([
					function(x, y, process){
						$.run(function(){
							var t = tiles[0][x][y],
								type = t.type(),
								n = Tile.Obj.hasNeighborOfType,
								water = n(t, 'water', 2),
								grass = n(t, 'grass', 1),
								town = n(t, 'town', 12);
							if (water > 3) {
								self.transform(t).to('water');
								t.depth(3);
							} else if (type === 'water') {
								self.transform(t).to('grass');
							}
							if (type !== 'town' && n(t, 'town', 1)) {
								self.transform(t).to('farm');
							}
							if (type === 'town' && town > 1) {
								self.transform(t).to('grass');
							}
						});
					},
					function(x, y, process){
						$.run(function(){
							var t = tiles[0][x][y],
								type = t.type(),
								n = Tile.Obj.hasNeighborOfType,
								water = n(t, 'water', 4),
								grass = n(t, 'grass', 1);
							if ((type === 'grass' || type === 'meadow') && grass < 5) {
								self.transform(t).to('water');
								t.depth(1);
							}
							if (type === 'farm' && !n(t, 'town', 2)) {
								self.transform(t).to('grass');
							}
						});
					}
				], 3, function(){
					callback();
				});
			}
		};
	}
};

// END WORLD
// --------------------------------------------------
