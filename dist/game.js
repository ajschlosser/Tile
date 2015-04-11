(function(Tile, undefined){

Tile.async = {};

Tile.async.each = function (arr, iterator, callback) {
		function only_once(fn) {
			var called = false;
			return function() {
				if (called) throw new Error("Callback was already called.");
				called = true;
				fn.apply(this, arguments);
			};
		}
		callback = callback || function () {};
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
				callback = function () {};
			}
			else {
				completed += 1;
				if (completed >= arr.length) {
						callback();
				}
			}
		}
};
Tile.Obj = {
	create: function(params) {
		params = params || {};
		var x = params.x,
			y = params.y,
			z = params.z || 0,
			type = params.type,
			sprite = params.sprite,
			visible = (params.visible === true || params.visible === false) ? params.visible : true,
			actions = params.actions || [];
		return {
			sprite: function() { return sprite; },
			visible: function() { return visible; },
			show: function() { visible = true; },
			hide: function() { visible = false; },
			x: function(i) { if (Number.isInteger(i)) x = i; else return x; },
			y: function(i) { if (Number.isInteger(i)) y = i; else return y; },
			z: function(i) { if (Number.isInteger(i)) z = i; else return z; },
			do: function(action) { actions.push(action); },
			actions: function() { return actions; },
			type: function(t) { if (typeof t === 'string') type = t; else return type; },
			coords: function(x, y) { if (Number.isInteger(x) && Number.isInteger(y)) { x = x; y = y; } else return [x, y, z]; },
		};
	}
};
Tile.World = {
	create: function(params) {
		params = params || {};
		var tilesize = params.tilesize || 16,
			w = params.w / tilesize || 40,
			h = params.h / tilesize || 30,
			tiles = { 0: [] },
			actions = {};
		for (var x = 0; x < w; x++) {
			for (var y = 0; y < h; y++) {
				var tile = Tile.Obj.create({
					x: x,
					y: y,
					type: Math.random()*100 < 95 ? 'grass' : 'water',
					actions: ['gonuts']
				});
				tiles[0].push(tile);
			}
		}
		return  {
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
				throw new Error('No Tile object exists at (' + x + ', ' + y + ')');
			},
			tilesize: function(ts) { if (Number.isInteger(ts)) tilesize = ts; else return tilesize; },
			put: function(tile) {
				tiles[tile.z()].push(tile);
			},
			act: function(name, action) {
				this.actions()[name] = action;
			},
			actions: function() { return actions; },
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
						actions[name](obj);
					});
				});
			}
		};
	}

};
Tile.Canvas = {
	create: function(params) {
		var id = params.id || 'container',
			container = document.getElementById(id),
			canvas = document.createElement('canvas'),
			context = canvas.getContext('2d'),
			world = params.world || Tile.World.create(),
			sprites = {},
			fps = params.fps || 60,
			tilesize;
		Tile.async.each(params.sprites, function(sprite){
			sprites[sprite.type()] = sprite;
		});
		canvas.width = params.w || 0;
		canvas.height = params.h || 0;
		container.appendChild(canvas);
		canvas.addEventListener('click', function(evt){
			var x = Math.floor(evt.offsetX / tilesize),
				y = Math.floor(evt.offsetY / tilesize);
			console.log(world.tile(x,y));
		});
		return {
			w: function() { return w; },
			h: function() { return h; },
			ctx: function() {
				return context;
			},
			sprite: function(sprite) {
				sprites[sprite.type()] = sprite;
			},
			init: function(callback) {
				var types = Object.getOwnPropertyNames(sprites);
				Tile.async.each(types, function(type, next){
					sprites[type].loaded(function(){
						next();
					});
				}, function() {
					callback();
				});
			},
			draw: function(obj) {
				var sprite = sprites[obj.type()];
				if (sprite) {
					context.drawImage(sprite.img(), obj.x()*tilesize, obj.y()*tilesize, 16, 16);
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
				context.clearRect(0, 0, canvas.width, canvas.height);
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
}(window.Tile = window.Tile || {}));

// Game code

var grass = Tile.Sprite.create({
	src: 'art/grass.png',
	w: 16,
	h: 16,
	type: 'grass'
});
var water = Tile.Sprite.create({
	src: 'art/water.png',
	w: 16,
	h: 16,
	type: 'water'
});
var game = Tile.Canvas.create({
	w: 640,
	h: 480,
	sprites: [grass, water],
	run: true
});
game.world().act('gonuts', function(obj){
	if (obj.x() === 1 && obj.y() === 1) {
		console.log(obj);
	}
});
game.run();