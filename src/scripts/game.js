// --------------------------------------------------
// TILE - A 2D JAVASCRIPT TILE ENGINE
// --------------------------------------------------

(function(Tile, undefined){

// --------------------------------------------------
// ASYNC

Tile.async = {
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
	}
};

// END ASYNC
// --------------------------------------------------

// --------------------------------------------------
// OBJ

Tile.Obj = {
	create: function(params) {
		params = params || {};
		var x = params.x,
			y = params.y,
			z = params.z || 0,
			depth = params.depth || 0,
			type = params.type,
			visible = (params.visible === true || params.visible === false) ? params.visible : true,
			actions = params.actions || [],
			properties = params.properties || {};
		return {
			visible: function(b) { if (typeof b === 'boolean') visible = b; else return visible; },
			x: function(n) { if (Number.isInteger(n)) x = n; else return x; },
			y: function(n) { if (Number.isInteger(n)) y = n; else return y; },
			z: function(n) { if (Number.isInteger(n)) z = n; else return z; },
			depth: function(n) { if (Number.isInteger(n)) depth = n; else return depth; },
			actions: function(action) { if (typeof action === 'function') actions.push(action); else return actions; },
			properties: function() { return properties; },
			type: function(t) { if (typeof t === 'string') type = t; else return type; }
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
		var tilesize = params.tilesize || 16,
			w = params.w / tilesize || 40,
			h = params.h / tilesize || 30,
			tiles = { 0: [] },
			events = { click: [], dblclick: [] },
			actions = { '*': {} };
		return  {
			width: function() { return w; },
			height: function() { return h; },
			tile: function(x, y, z) {
				z = z || 0;
				var ts = tiles[z],
					l = ts.length,
					vert = w > h ? true : false,
					i = 0,
					t;
				if (vert) {
					for (i = 0; i < l; i++) {
						t = ts[i];
						if (t.y() === y && t.x() === x) {
							return t;
						}
					}
				} else {
					for (i = 0; i < l; i++) {
						t = ts[i];
						if (t.x() === x && t.y() === y) {
							return t;
						}
					}
				}
				return;
				//throw new Error('No Tile object exists at (' + x + ', ' + y + ')');
			},
			tilesize: function(ts) { if (Number.isInteger(ts)) tilesize = ts; else return tilesize; },
			put: function(tile) {
				tiles[tile.z()].push(tile);
			},
			action: function(params) {
				var name = params.name || Object.getOwnPropertyNames(actions).length + 1,
					action = params.action,
					types = params.types || [],
					events = params.events || [];
				if (!name) {
					throw new Error('Actions require a name');
				} else if (typeof action !== 'function') {
					throw new Error('The ' + name + ' action needs to be a function');
				}
				if (types && types.length) {
					Tile.async.each(types, function(type){
						if (!actions[type]) {
							actions[type] = {};
						}
						actions[type][name] = {
							run: action,
							types: function() { return types; },
							events: function() { return events; }
						};
					});
				} else {
					actions['*'][name] = {
						run: action,
						types: function() { return types; },
						events: function() { return events; }
					};
				}
			},
			actions: function() { return actions; },
			events: function() { return events; },
			getRandomNeighborOf: function(obj) {
				var n1 = Math.random() * 2 > 1 ? 1 : -1,
					n2 = Math.random() * 2 > 1 ? 1 : -1,
					m1 = Math.random() * 2 > 1 ? 0 : 1,
					m2 = Math.random() * 2 > 1 ? 0 : 1,
					x = obj.x() + n1*m1,
					y = obj.y() + n2*m2,
					z = obj.z() || 0,
					o = this.tile(x,y,z);
				if (o) {
					return o;
				}
			},
			generate: function() {
				for (var x = 0; x < w; x++) {
					for (var y = 0; y < h; y++) {
						var r = Math.random()*100;
						var tile = Tile.Obj.create({
							x: x,
							y: y,
							type: r < 90 ? 'grass' : 'water',
							actions: ['wetten', 'flood', 'info'],
							depth: r < 90 ? 0 : 1,
							properties: {
								wetness: r < 95 ? 0 : 6
							}
						});
						tiles[0].push(tile);
					}
				}
			},
			render: function(canvas, z) {
				z = z || 0;
				var objs = tiles[z];
				Tile.async.each(objs, function(obj){
					if (obj.visible()) {
						canvas.draw(obj);
					}
				});
				Tile.async.each(objs, function(obj){
					Tile.async.each(obj.actions(), function(name){
						function run(a) {
							if (a.events().length) {
								var x = obj.x(),
									y = obj.y();
								Tile.async.each(a.events(), function(event){
									for (var i = 0; i < events[event].length; i++) {
										var e = events[event][i];
										if (e.x === x && e.y === y) {
											events[event].splice(i, 1);
											a.run(obj);
										}
									}
								});
							} else {
								a.run(obj);
							}
						}
						var type = actions[obj.type()],
							any = actions['*'][name];
						if (type && type[name]) {
							run(type[name]);
						} else if (any) {
							run(any);
						}
					});
				});
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
		var id = params.id || 'container',
			container = document.getElementById(id),
			canvas = document.createElement('canvas'),
			context = canvas.getContext('2d'),
			world = params.world || Tile.World.create(),
			sprites = {},
			clicks = [],
			fps = params.fps || 60,
			tilesize;
		Tile.async.each(params.sprites, function(sprite){
			sprites[sprite.type] = Tile.Sprite.create(sprite);
		});
		canvas.width = params.w || 0;
		canvas.height = params.h || 0;
		container.appendChild(canvas);
		Tile.async.each(Object.getOwnPropertyNames(world.events()), function(evt) {
			canvas.addEventListener(evt, function(e){
				world.events()[evt].push({
					x: Math.floor(e.offsetX / tilesize),
					y: Math.floor(e.offsetY / tilesize)
				});
			});			
		});
		return {
			width: function() { return canvas.width; },
			height: function() { return canvas.width; },
			ctx: function() {
				return context;
			},
			sprite: function(sprite) {
				sprites[sprite.type()] = sprite;
			},
			init: function(callback) {
				var types = Object.getOwnPropertyNames(sprites);
				world.generate();
				Tile.async.each(types, function(type, next){
					sprites[type].loaded(function(){
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
					if (depth > 0) {
						context.save();
						context.globalAlpha = 1.0 - parseFloat('0.1' + depth);
					}
					context.drawImage(sprite.img(), obj.x()*tilesize, obj.y()*tilesize, 16, 16);
					if (depth > 0) {
						context.restore();
					}
				} else {
					throw new Error('No sprite found for "' + obj.type()) + '" at (' + obj.x() + ',' +obj.y() + ')';
				}
			},
			style: function(css) {
				if (typeof css === 'object') {
					var props = Object.getOwnPropertyNames(css);
					Tile.async.each(props, function(prop) {
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
			world: function() { return world; },
			clear: function() {
				context.fillStyle = '#000000';
				context.fillRect(0,0,canvas.width,canvas.height);
				//context.clearRect(0, 0, canvas.width, canvas.height);
			},
			run: function() {
				var self = this;
				self.init(function(){
					function sequence() {
						self.clear();
						world.render(self);
					}
					tilesize = world.tilesize();
					var running = window.setInterval(sequence, 1000 / fps);
				});
			}
		};
	}
};

// END ENGINE
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
			type: function(t) { if (typeof t === 'string') type = t; else return type; },
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

}(window.Tile = window.Tile || {}));

// Game code

var sprites = [
	{
		src: 'art/grass.png',
		w: 16,
		h: 16,
		type: 'grass'
	},
	{
		src: 'art/water.png',
		w: 16,
		h: 16,
		type: 'water'
	}
];

var game = Tile.Engine.create({
	w: 640,
	h: 480,
	sprites: sprites
});

game.world().action({
	name: 'wetten',
	types: ['grass', 'water'],
	action: function(obj){
		if (obj.properties().wetness >= 4) {
			obj.type('water');
		} else {
			obj.type('grass');
		}
	}
});
game.world().action({
	name: 'flood',
	types: ['water'],
	action: function(obj){
		var neighbor = game.world().getRandomNeighborOf(obj);
		if (neighbor && neighbor.depth() >= obj.depth()) {
			if (neighbor.properties().wetness < 4) {
				neighbor.properties().wetness += 1;
			}
		}
	}
});
game.world().action({
	name: 'info',
	types: ['water', 'grass'],
	events: ['click'],
	action: function(obj){
		var depth = obj.depth();
		obj.depth(depth+1);
		console.log(obj.properties(), obj.depth());
	}
});
game.run();