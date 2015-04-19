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
// BEGIN TOOLS

Tile.tools = {
	extend: function(o1, o2) {
		var keys = Object.getOwnPropertyNames(o2);
		keys.forEach(function(k) {
			if (!o1[k]) o1[k] = o2[k];
		});
		return o1;
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
	keys: function(o) { return Object.getOwnPropertyNames(o); }
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

// --------------------------------------------------
// OBJ

Tile.Obj = {
	create: function(params) {
		params = params || {};
		var x = params.x,
			y = params.y,
			z = params.z || 0,
			height = params.height || 0,
			depth = params.depth || 0,
			type = params.type,
			visible = (params.visible === true || params.visible === false) ? params.visible : true,
			actions = params.actions || [],
			properties = Tile.tools.extend({}, params.properties);
		return {
			visible: function(b) { if (typeof b === 'boolean') visible = b; else return visible; },
			x: function(n) { if (Number.isInteger(n)) x = n; else return x; },
			y: function(n) { if (Number.isInteger(n)) y = n; else return y; },
			z: function(n) { if (Number.isInteger(n)) z = n; else return z; },
			height: function(n) { if (Number.isInteger(n)) height = n; else return height; },
			depth: function(n) { if (Number.isInteger(n) && n < 7) depth = n; else return depth; },
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
		var w = params.w || params.width,
			h = params.h || params.height,
			types = function(t) { if (params.types[t]) return params.types[t]; else return params.types['*']; },
			tiles = { 0: [] };
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
			},
			tiles: function(z) { return tiles[z]; },
			put: function(tile) {
				tiles[tile.z()].push(tile);
			},
			generate: function() {
				for (var x = 0; x < w; x++) {
					for (var y = 0; y < h; y++) {
						var r = Math.random()*100,
							type = r < 90 ? 'grass' : 'water';
						var tile = Tile.Obj.create({
							x: x,
							y: y,
							type: type,
							actions: ['wetten', 'flood', 'deepen', 'info'],
							height: type === 'grass' ? 7 : 6,
							depth: type === 'water' ? 1 : 0,
							properties: types(type)
						});
						tile.properties().wetness = r < 95 ? 0 : 6;
						tiles[0].push(tile);
					}
				}
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
			container = document.getElementById(id),
			canvas = document.createElement('canvas'),
			context = canvas.getContext('2d');
		canvas.width = params.w || params.width || 0;
		canvas.height = params.h || params.height || 0;
		container.appendChild(canvas);

		// Engine
		var options = params.options || {},
			ui = {},
			sprites = {},
			clicks = [],
			utils = params.utils || {},
			events = options.events || { 
				click: [],
				mousemove: []
			},
			actions = { '*': {} },
			fps = params.fps || 60,
			tilesize = params.tilesize || 16,
			world = params.world || Tile.World.create({
				width: canvas.width / tilesize,
				height: canvas.height / tilesize,
				types: params.types || { '*': {} }
			});

		// UI
		Tile.async.each(Tile.tools.keys(params.ui), function(id){
			var e = document.getElementById(id),
				buttons = params.ui[id].buttons ? Tile.tools.keys(params.ui[id].buttons) : null;
			params.ui[id].id = e;
			if (buttons) {
				buttons.forEach(function(button){
					var b = document.getElementById(button),
						props = params.ui[id].buttons[button];
					b.addEventListener(props.event, function(){
						if (props.callback) {
							props.action(e, props.callback);	
						} else {
							props.action(e);
						}
					});
				});
			}
			Tile.tools.extend(params.ui[id], {
				show: function(d) {
					if (d) {
						e.style.display = d;
					} else {
						e.style.display = 'block';
					}
				},
				hide: function() {
					e.style.display = 'none';
				}
			});
			console.log(params.ui[id]);
			ui[id] = params.ui[id];
		});

		// SPRITES
		Tile.async.each(params.sprites, function(sprite){
			sprites[sprite.type] = Tile.Sprite.create(sprite);
		});

		// ACTIONS
		Tile.async.each(params.actions, function(a){
				var name = a.name || Object.getOwnPropertyNames(actions).length + 1,
					action = a.action,
					types = [],
					events = a.events || [];
				Tile.async.each(Tile.tools.keys(params.types), function(type){
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
		});

		// EVENTS
		Tile.async.each(Object.getOwnPropertyNames(events), function(evt) {
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
				events[evt].push({
					x: Math.floor(e.offsetX / tilesize),
					y: Math.floor(e.offsetY / tilesize),
					conditions: {
						alt: e.altKey,
						shift: e.shiftKey,
						ctrl: e.ctrlKey,
						button: e.button
					},
					ready: function() { return ready; }
				});
			});         
		});

		// PUBLIC INTERFACE
		return {
			utils: function() { return utils; },
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
						context.globalAlpha = 1.0 - parseFloat('0.' + depth);
					}
					context.drawImage(sprite.img(), obj.x()*tilesize, obj.y()*tilesize, tilesize, tilesize);
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
			actions: function() { return actions; },
			events: function() { return events; },
			world: function() { return world; },
			clear: function() {
				context.clearRect(0, 0, canvas.width, canvas.height);
			},
			render: function(world, z) {
				var self = this;
				z = z || 0;
				var objs = world.tiles(z);
				Tile.async.each(objs, function(obj){
					if (obj.visible()) {
						self.draw(obj);
					}
				});
				Tile.async.each(objs, function(obj){
					Tile.async.each(obj.actions(), function(name){
						function run(a) {
							if (a.events().length) {
								var x = obj.x(),
									y = obj.y();
								Tile.async.each(a.events(), function(event){
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
												var matched = Tile.tools.contains(e.conditions, conditions);
												if (e.ready() && matched) {
													events[type].splice(i, 1);
													a.run(obj);
												}
											}
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
			},
			run: function() {
				var self = this;
				self.init(function(){
					function sequence() {
						self.clear();
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
// --------------------------------------------------
// BEGIN UI

var ui = {
	dialog: {
		buttons: {
			ok: {
				event: 'click',
				action: function(e) {
					ui.dialog.hide();
				}
			}
		}
	}
};

// END UI
// --------------------------------------------------
// --------------------------------------------------
// BEGIN SPRITES

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

// END SPRITES
// --------------------------------------------------
// --------------------------------------------------
// BEGIN TYPES

var types = {
	'*': {
		levels: {
			water: 0
		},
		actions: ['deepen', 'info']
	},
	grass: {
		actions: ['wetten']
	},
	water: {
		flows: true,
		actions: ['flood']
	}
};

// END TYPES
// --------------------------------------------------
// --------------------------------------------------
// BEGIN ACTIONS

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
		name: 'info',
		events: [{
			type: 'click',
			conditions: {
				shift: true
			}
		}],
		action: function(obj){
			ui.dialog.show();
		}
	}
];

// END ACTIONS
// --------------------------------------------------
// --------------------------------------------------
// BEGIN UTILS

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
	}
};

// END UTILS
// --------------------------------------------------
// --------------------------------------------------
// BEGIN GAME

var game = Tile.Engine.create({
	w: 640,
	h: 480,
	tilesize: 16,
	utils: utils,
	ui: ui,
	types: types,
	sprites: sprites,
	actions: actions
});

game.run();

// END GAME
// --------------------------------------------------