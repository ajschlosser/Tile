// --------------------------------------------------
// TILE - A 2D JAVASCRIPT TILE ENGINE
// --------------------------------------------------

// --------------------------------------------------
// LICENSE

/*
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

(function(Tile, undefined){

// --------------------------------------------------
// TOOLS

Tile.tools = $ = {
	any: function(arr) {
		var i = Math.floor(Math.random()*arr.length);
		return arr[i];
	},
	assign: function(o1, o2) {
		return this.extend(o1, o2, true);
	},
	clone: function(o) {
		var x = {},
			keys = Object.getOwnPropertyNames(o);
		keys.forEach(function(k) {
			x[k] = o[k];
		});
		return x;
	},
	contains: function(o1, o2) {
		var keys = Object.getOwnPropertyNames(o2),
			contains;
		keys.forEach(function(k) {
			contains = o1[k] === o2[k];
		});
		return contains;
	},
	each: function (arr, iterator, callback) {
		function only_once(fn) {
			var called = false;
			return function() {
				if (called) throw new Error("Callback was already called.");
				called = true;
				fn.apply(this, arguments);
			};
		}
		callback = callback || function() {};
		if (!arr.length) {
			return callback();
		}
		var completed = 0;
		arr.forEach(function (x) {
			iterator(x, only_once(done) );
		});
		function done(err) {
			if (err) {
				callback(err);
				callback = function() {};
			}
			else {
				completed += 1;
				if (completed >= arr.length) {
						callback();
				}
			}
		}
	},
	extend: function(o1, o2, assign) {
		var keys = Object.getOwnPropertyNames(o2);
		keys.forEach(function(k) {
			if (!o1[k]) {
				o1[k] = o2[k];
			} else if (assign === true) {
				o1[k] = o2[k];
			}
		});
		return o1;
	},
	keys: function(o) {
		if (typeof o === 'object') {
			return Object.getOwnPropertyNames(o);
		}
	},
	parallel: function(tasks, callback) {
		callback = callback || function() {};
		var results = {};
		this.each(Object.getOwnPropertyNames(tasks), function(task, callback) {
			tasks[task](function(err) {
				var args = Array.prototype.slice.call(arguments, 1);
				if (args.length <= 1) {
					args = args[0];
				}
				results[task] = args;
				callback(err);
			});
		}, function(err) {
			callback(err, results);
		});
	},
	run: function(fn) {
		if (typeof fn === 'function') {
			setTimeout(fn,1);
		}
	},
	tug: function(arr) {
		var i = Math.floor(Math.random()*arr.length);
		return arr.splice(i,1)[0];
	}
};

// END TOOLS
// --------------------------------------------------

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
			properties = $.extend({}, params.properties);
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
			properties: function() {
				return properties;
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

// --------------------------------------------------
// WORLD

Tile.World = {
	create: function(params) {
		params = params || {};
		var width = params.width,
			height = params.height,
			total = width * height,
			types = function(t) {
				if (params.types[t]) {
					return params.types[t];
				} else {
					return params.types['*'];
				}
			},
			tiles = { 0: [] };
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
			everywhere: function(fn, i) {
				var self = this;
				fn = Array.isArray(fn) ? fn : [fn];
				i = i || 0;
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
				}
				while (i--) {
					fn.forEach(run);
				}
			},
			generate: function() {
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
							height : type === 'grass' ? 7 : 6,
							depth : type === 'water' ? 1 : 0,
							properties : types(type)
						});
						if (type !== 'town') {
							//tile.properties().wetness = r < 950 ? 0 : 6;
						}
						tiles[0][x][y] = tile;
					}
				}
				var status;
				self.everywhere([
					function(x, y, process){
						ui.status.content('Creating lakes and oceans (' + process.remaining + ')... ' + process.percent + '%'  + ' (' + process.index + ' pass(es) remaining)');
						$.run(function(){
							var t = tiles[0][x][y],
								type = t.type(),
								n = Tile.Obj.hasNeighborOfType,
								water = n(t, 'water', 2),
								grass = n(t, 'grass', 1),
								town = n(t, 'town', 12);
							if (water > 3) {
								t.type('water');
								t.depth(2);
								t.height(6);
							} else if (type === 'water') {
								t.type('grass');
							}
							if (type !== 'town' && n(t, 'town', 1)) {
								t.type('farm');
							}
							if (type === 'town' && town > 1) {
								t.type('grass');
							}
						});
					},
					function(x, y, process){
						ui.status.content('Creating lakes and oceans (' + process.remaining + ')... ' + process.percent + '%' + ' (' + process.index + ' pass(es) remaining)');
						$.run(function(){
							var t = tiles[0][x][y],
								type = t.type(),
								n = Tile.Obj.hasNeighborOfType,
								water = n(t, 'water', 4),
								grass = n(t, 'grass', 1);
							if ((type === 'grass' || type === 'meadow') && grass < 5) {
								t.type('water');
								t.depth(1);
							}
							if (type === 'farm' && !n(t, 'town', 2)) {
								t.type('grass');
							}
						});
					}
				], 3);
				ui.status.content();
			}
		};
	}
};

// END WORLD
// --------------------------------------------------

// --------------------------------------------------
// ENGINE

Tile.Engine = {
	create: function(params) {

		// INITIALIZE PRIVATE VARIABLES

		// Canvas
		var id = params.id || 'container',
			container = document.getElementById(id) || document.createElement('div'),
			canvas = document.createElement('canvas'),
			buffer = document.createElement('canvas'),
			context = canvas.getContext('2d'),
			buffer_ctx = buffer.getContext('2d');
		canvas.width = buffer.width = params.w || params.width || 0;
		canvas.height = buffer.height = params.h || params.height || 0;
		canvas.addEventListener('contextmenu', function(evt){
			evt.preventDefault();
		});
		context.imageSmoothingEnabled = buffer_ctx.imageSmoothingEnabled = false;
		if (!container.id || container.id === '') {
			container.id = id;
			document.getElementsByTagName('body')[0].appendChild(container);
		}
		container.appendChild(canvas);
		buffer.id = 'buffer';
		container.appendChild(buffer);

		// Engine
		var options = params.options || {},
			tilesize = params.tilesize || 16,
			ui = {},
			view = {
				width: Math.floor(canvas.width / tilesize),
				height: Math.floor(canvas.height / tilesize)
			},
			camera = {
				x: Math.floor(canvas.width / tilesize / 2),
				y: Math.floor(canvas.height / tilesize / 2),
			},
			sprites = {},
			spritemaps = {},
			clicks = [],
			utils = params.utils || {},
			events = options.events || { 
				click: [],
				mousemove: []
			},
			actions = { '*': {} },
			fps = params.fps || 60,
			world = Tile.World.create({
				width : params.world.width || view.width,
				height : params.world.height || view.height,
				types : params.types || { '*': {} }
			});

		// UI
		$.each($.keys(params.ui), function(uid){
			var e = document.createElement('div'),
				buttons = params.ui[uid].buttons ? $.keys(params.ui[uid].buttons) : null;
			e.id = uid;
			e.style.display = params.ui[uid].display || 'none';
			var title = document.createElement('h1');
			title.className = 'title ' + uid;
			title.innerText = params.ui[uid].title || null;
			e.appendChild(title);
			var content = document.createElement('p');
			content.className = 'content ' + uid;
			content.innerHTML = params.ui[uid].content || null;
			e.appendChild(content);
			if (buttons) {
				buttons.forEach(function(button){
					var b = document.createElement('button'),
						props = params.ui[uid].buttons[button];
					b.className = 'button ' + uid + ' ' + button;
					if (props.text) {
						b.innerText = props.text;
					}
					b.addEventListener(props.event, function(){
						if (props.callback) {
							props.action(e, props.callback);	
						} else {
							props.action(e);
						}
					});
					e.appendChild(b);
				});
			}
			container.appendChild(e);
			params.ui[uid].id = e;
			$.extend(params.ui[uid], {
				title: function(s) {
					setTimeout(function() {
						title.innerText = s || '';
					},1);
				},
				content: function(s) {
					setTimeout(function() {
						content.innerHTML = s || '';
					},1);
				},
				show: function(s) {
					if (s) {
						e.style.display = s;
					} else {
						e.style.display = 'block';
					}
				},
				hide: function() {
					e.style.display = 'none';
				}
			});
			ui[uid] = params.ui[uid];
		});

		// SPRITES
		$.each(params.sprites, function(sprite){
			sprites[sprite.type] = Tile.Sprite.create(sprite);
			spritemaps[sprite.type] = [];
			for (var i = 0; i < 9; i++) {
				spritemaps[sprite.type].push({
					x: i * tilesize,
					y: ($.keys(sprites).length - 1) * tilesize
				});
			}
		});

		// ACTIONS
		$.each(params.actions, function(a){
			var name = a.name || Object.getOwnPropertyNames(actions).length + 1,
				action = a.action,
				types = [],
				events = a.events || [];
			$.each($.keys(params.types), function(type){
				if (params.types[type].actions && params.types[type].actions.indexOf(name) !== -1) {
					types.push(type);
				}
			});
			if (!name) {
				throw new Error('Actions require a name');
			} else if (typeof action !== 'function') {
				throw new Error('The ' + name + ' action needs to be a function');
			}
			if (types && types.length) {
				$.each(types, function(type){
					if (!actions[type]) {
						actions[type] = {};
					}
					actions[type][name] = {
						run: action,
						types: function() {
							return types;
						},
						events: function() {
							return events;
						}
					};
				});
			} else {
				actions['*'][name] = {
					run: action,
					types: function() {
						return types;
					},
					events: function() {
						return events;
					}
				};
			}
		});

		// EVENTS
		$.each(Object.getOwnPropertyNames(events), function(evt) {
			canvas.addEventListener(evt, function(e){
				var ready = true;
				if (options.dblclick) {
					ready = false;
					var timer = setTimeout(function(){
							ready = true;
						}, 200);
					if (e.type === 'dblclick') {
						events.click = [];
						ready = true;
					}
				}
				var x = Math.floor(e.offsetX / tilesize),
					y = Math.floor(e.offsetY / tilesize),
					w = Math.floor(view.width/2),
					h = Math.floor(view.height/2),
					offset;
				if (x <= camera.x && y <= camera.y) {
					offset = {
						x: (camera.x - (w - x)),
						y: (camera.y - (h - y))
					};
				}
				if (x <= camera.x && y >= camera.y) {
					offset = {
						x: (camera.x - (w - x)),
						y: (camera.y + (y - h))
					};
				}
				if (x >= camera.x && y >= camera.y) {
					offset = {
						x: (camera.x + (x - w)),
						y: (camera.y + (y - h))
					};
				}
				if (x >= camera.x && y <= camera.y) {
					offset = {
						x: (camera.x + (x - w)),
						y: (camera.y - (h - y))
					};
				}
				events[evt].push({
					x : offset.x,
					y : offset.y,
					conditions : {
						alt : e.altKey,
						shift : e.shiftKey,
						ctrl : e.ctrlKey,
						button : e.button
					},
					ready : function() {
						return ready;
					}
				});
				e.preventDefault();
			});         
		});

		// PUBLIC INTERFACE
		return {
			utils: function() {
				return utils;
			},
			width: function() {
				return canvas.width;
			},
			height: function() {
				return canvas.width;
			},
			ctx: function() {
				return context;
			},
			sprite: function(sprite) {
				sprites[sprite.type()] = sprite;
			},
			tilesize: function(n) {
				this.clear();
				if (Number.isInteger(n)) {
					tilesize = n;
					view = {
						width: Math.floor(canvas.width / tilesize),
						height: Math.floor(canvas.height / tilesize)
					};
					camera = {
						x: Math.floor(canvas.width / tilesize / 2),
						y: Math.floor(canvas.height / tilesize / 2),
					};
				} else {
					return tilesize;
				}
			},
			init: function(callback) {
				var types = Object.getOwnPropertyNames(sprites);
				world.generate();
				$.each(types, function(type, next){
					sprites[type].loaded(function(){
						spritemaps[type].forEach(function(map, i){
							var alpha = '0.' + i;
							if (options.draw) {
								var buf = document.createElement('canvas');
								buf.width = tilesize;
								buf.height = tilesize;
								buf_ctx = buf.getContext('2d');
								buf_ctx.imageSmoothingEnabled = false;
								buf_ctx.drawImage(sprites[type].img(), 0, 0, tilesize, tilesize);
								buf_ctx.fillStyle = 'rgba(0,0,0,' + alpha + ')';
								buf_ctx.fillRect(0, 0, tilesize, tilesize);
								map.img = new Image(tilesize,tilesize);
								map.img.src = buf.toDataURL();
							} else {
								buffer_ctx.drawImage(sprites[type].img(), map.x, map.y, tilesize, tilesize);
								buffer_ctx.fillStyle = 'rgba(0,0,0,' + alpha + ')';
								buffer_ctx.fillRect(map.x,map.y,tilesize,tilesize);
								map.img = buffer_ctx.getImageData(map.x,map.y,tilesize,tilesize);
							}
						});
						next();
					});
				}, function() {
					callback();
				});
			},
			draw: function(obj) {
				var sprite = sprites[obj.type()],
					depth = obj.depth();
				if (sprite) {
					var x = obj.x(),
						y = obj.y(),
						w = Math.floor(view.width/2),
						h = Math.floor(view.height/2),
						offset;
					if (x <= camera.x && y <= camera.y) {
						offset = {
							x: (w - (camera.x - x)),
							y: (h - (camera.y - y))
						};
					}
					if (x <= camera.x && y >= camera.y) {
						offset = {
							x: (w - (camera.x - x)),
							y: (h + (y - camera.y))
						};
					}
					if (x >= camera.x && y >= camera.y) {
						offset = {
							x: (w + (x - camera.x)),
							y: (h + (y - camera.y))
						};
					}
					if (x >= camera.x && y <= camera.y) {
						offset = {
							x: (w + (x - camera.x)),
							y: (h - (camera.y - y))
						};
					}
					if (options.draw) {
						context.drawImage(spritemaps[obj.type()][obj.depth()].img, offset.x*tilesize, offset.y*tilesize, tilesize, tilesize);
					} else {
						context.putImageData(spritemaps[obj.type()][obj.depth()].img, offset.x*tilesize, offset.y*tilesize);
					}
				} else {
					throw new Error('No sprite found for "' + obj.type()) + '" at (' + obj.x() + ',' +obj.y() + ')';
				}
			},
			style: function(css) {
				if (typeof css === 'object') {
					var props = Object.getOwnPropertyNames(css);
					$.each(props, function(prop) {
						prop = prop.split('-');
						var camelCase = prop[0];
						var l = prop.length;
						for (var i = 1; i < l; i++) {
							camelCase += prop[i].charAt(0).toUpperCase() + prop[i].slice(1);
						}
						canvas.style[camelCase] = css[prop];
					});
				}
			},
			spritemap: function(type) {
				return spritemaps[type];
			},
			actions: function() {
				return actions;
			},
			events: function() {
				return events;
			},
			world: function() {
				return world;
			},
			camera: function(params) {
				if (params) {
					camera.x = params.x;
					camera.y = params.y;
				} else {
					return camera;
				}
			},
			view: function() {
				return view;
			},
			clear: function() {
				context.clearRect(0, 0, canvas.width, canvas.height);
			},
			render: function(world, z) {
				var self = this;
				function run(action) {
					if (action.events().length) {
						$.each(action.events(), function(event){
							var type,
								conditions;
							if (typeof event === 'object') {
								type = event.type;
								conditions = event.conditions;
							} else {
								type = event;
							}
							if (events[type] && events[type].length) {
								for (var i = 0; i < events[type].length; i++) {
									var e = events[type][i];
									if (e.x === x && e.y === y) {
										if (e.ready() && ((event.conditions && $.contains(e.conditions, conditions)) || !event.conditions)) {
											events[type].splice(i, 1);
											action.run(obj);
										}
									}
								}
							}
						});
					} else {
						action.run(obj);
					}
				}
				function process(name) {
					var type = actions[obj.type()],
						any = actions['*'][name];
					if (type && type[name] && (obj.visible() || type[name].always())) {
						run(type[name]);
					} else if (any && (obj.visible() || type[name].always())) {
						run(any);
					}
				}
				z = z || 0;
				var rows = world.tiles(z);
				for (var x = Math.floor(camera.x - view.width/2); x <= Math.floor(camera.x + view.width/2); x++) {
					for (var y = Math.floor(camera.y - view.height/2); y <= Math.floor(camera.y + view.height/2); y++) {
						if (rows[x] && rows[x][y]) {
							var obj = rows[x][y];
							if (obj) {
								if (obj.visible()) {
									self.draw(obj);
								}
								var todo = $.keys(actions[obj.type()] || {}).concat($.keys(actions['*'] || {}));
								$.each(todo, process);
							}
						}
					}
				}
			},
			run: function() {
				var self = this;
				self.init(function(){
					function sequence() {
						self.render(world);
					}
					var running = window.setInterval(sequence, 1000 / fps);
				});
			}
		};
	}
};

}(window.Tile = window.Tile || {}));

// END ENGINE
// --------------------------------------------------
