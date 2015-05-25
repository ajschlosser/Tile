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
// TOOLS

Tile.tools = $ = {
	any: function(arr) {
		var i = Math.floor(Math.random()*arr.length);
		return arr[i];
	},
	assign: function(o1, o2) {
		return this.extend(o1, o2, true);
	},
	clone: function(o, deep) {
		var x = {},
			keys = Object.getOwnPropertyNames(o);
		if (!deep) {
			keys.forEach(function(k) {
				x[k] = o[k];
			});
		} else if (deep === true) {
			x = JSON.parse(JSON.stringify(o));
		}
		return x;
	},
	cut: function(o, exclude) {
		o = this.clone(o);
		exclude.forEach(function(k){
			if (o[k]) {
				delete o[k];
			}
		});
		return o;
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
	encapsulate: function(o) {
		function process(prop, key) {
			var primary = prop[key];
			if (!Array.isArray(prop[key])) {
				for (var i in primary) {
					if (primary[i] !== null && typeof primary[i] === 'object') {
						process(primary, i);
					} else if (typeof primary[i] !== 'function') {
						var secondary = primary[i];
						primary[i] = this.publicize(secondary);
					}
				}
			}
			prop[key] = this.publicize(primary);
		}
		this.traverse(o, process);
		return o;
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
	find: function(arr, o, callback) {
		var index;
		arr.forEach(function(a, i){
			if (a[0] === o[0] && a[1] === o[1]) {
				index = i;
			}
		});
		if (!callback) {
			return index;
		} else if (arr[index] && index) {
			callback(arr[index], index);
		}
	},
	getParams: function(fn) {
		var comments = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,
			params = /([^\s,]+)/g,
			s = fn.toString().replace(comments, ''),
			result = s.slice(s.indexOf('(')+1, s.indexOf(')')).match(params);
		if(result === null) {
			result = [];
		}
		return result;
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
	publicize: function(prop) {
		if (!Array.isArray(prop) && typeof prop !== 'function') {
			return function access(p) {
				if (p && prop[p]) {
					return prop[p]();
				} else if (p && !prop[p]) {
					return {
						get: function(){},
						set: function(){},
						add: function(){}
					};
				} else {
					var accesses = {
						get: function() {
							return prop;
						},
						set: function(value){
							prop = value;
						}
					};
					switch (typeof prop) {
						case 'number':
							$.extend(accesses, {
								add: function(n) {
									prop += parseFloat(n);
									return prop;
								}
							});
							break;
					}
					return accesses;
				}
			};
		} else {
			return prop;
		}
	},
	run: function(fn) {
		if (typeof fn === 'function') {
			setTimeout(fn,1);
		}
	},
	traverse: function(o, fn) {
		for (var i in o) {
			fn.apply(this, [o, i]);
			if (o[i] !== null && typeof o[i] === 'object' && !Array.isArray(o[i])) {
				this.traverse(o[i], fn);
			}
		}
	},
	tug: function(arr) {
		var i = Math.floor(Math.random()*arr.length);
		return arr.splice(i,1)[0];
	}
};

// END TOOLS
// --------------------------------------------------
