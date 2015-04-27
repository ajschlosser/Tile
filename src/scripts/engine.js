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
	keys: function(o) {
		if (typeof o !== 'object') {
			throw new Error(o + ' is not an object');
		}
		return Object.getOwnPropertyNames(o);
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
			actions: function(action) {
				if (typeof action === 'function') {
					actions.push(action);
				} else {
					return actions;
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
		var w = params.w || params.width,
			h = params.h || params.height,
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
				return w;
			},
			height: function() {
				return h;
			},
			tile: function(x, y, z) {
				z = z || 0;
				if (tiles[z][x] && tiles[z][x][y]) {
					return tiles[z][x][y];
				}
			},
			tiles: function(z) {
				return tiles[z];
			},
			put: function(tile) {
				tiles[tile.z()].push(tile);
			},
			generate: function() {
				for (var x = 0; x < w; x++) {
					tiles[0][x] = [];
					for (var y = 0; y < h; y++) {
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
							actions : ['wetten', 'flood', 'deepen', 'grow', 'info'],
							height : type === 'grass' ? 7 : 6,
							depth : type === 'water' ? 1 : 0,
							properties : types(type)
						});
						if (type !== 'town') {
							tile.properties().wetness = r < 950 ? 0 : 6;
						}
						tiles[0][x][y] = tile;
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
		canvas.addEventListener('contextmenu', function(evt){
			evt.preventDefault();
		});
		context.imageSmoothingEnabled = false;
		container.appendChild(canvas);

		// Engine
		var options = params.options || {},
			ui = {},
			camera = {
				x: Math.floor(canvas.width / params.tilesize / 2),
				y: Math.floor(canvas.height / params.tilesize / 2),
			},
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
			world = Tile.World.create({
				width : params.world.width || canvas.width / tilesize,
				height : params.world.height || canvas.height / tilesize,
				types : params.types || { '*': {} }
			});

		// UI
		Tile.async.each(Tile.tools.keys(params.ui), function(uid){
			var e = document.createElement('div'),
				buttons = params.ui[uid].buttons ? Tile.tools.keys(params.ui[uid].buttons) : null;
			e.id = uid;
			e.style.display = params.ui[uid].display || 'none';
			var title = document.createElement('h1');
			title.className = 'title ' + uid;
			e.appendChild(title);
			var content = document.createElement('p');
			content.className = 'content ' + uid;
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
			Tile.tools.extend(params.ui[uid], {
				title: function(s) {
					title.innerText = s;
				},
				content: function(s) {
					content.innerHTML = s;
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
					x : Math.floor(e.offsetX / tilesize),
					y : Math.floor(e.offsetY / tilesize),
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
					context.font = '10px sans-serif';
					context.fillText('('+obj.x()+', '+obj.y()+')',obj.x()*tilesize,obj.y()*tilesize+10);
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
					camera.x = params.x || camera.x;
					camera.y = params.y || camera.y;
				} else {
					return camera;
				}
			},
			clear: function() {
				context.clearRect(0, 0, canvas.width, canvas.height);
			},
			render: function(world, z) {
				var self = this;
				z = z || 0;
				var rows = world.tiles(z);
				for (var x = camera.x - Math.floor(canvas.width/tilesize/2); x < camera.x + Math.round(canvas.width/tilesize/2); x++) {
					for (var y = camera.y - Math.floor(canvas.height/tilesize/2); y < camera.y + Math.round(canvas.height/tilesize/2); y++) {
						if (rows[x] && rows[x][y]) {
							var obj = rows[x][y];
							if (obj) {
								if (obj.visible()) {
									self.draw(obj);
								}
								var as = Tile.tools.keys(actions[obj.type()] || {}).concat(Tile.tools.keys(actions['*'] || {}));
								Tile.async.each(as, function(name){
									function run(a) {
										if (a.events().length) {
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
															if (e.ready() && ((event.conditions && Tile.tools.contains(e.conditions, conditions)) || !event.conditions)) {
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
									if (type && type[name] && (obj.visible() || type[name].always())) {
										run(type[name]);
									} else if (any && (obj.visible() || type[name].always())) {
										run(any);
									}
								});
							}
						}
					}
				}

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