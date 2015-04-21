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
	},
	hasNeighborOfType: function(obj, type, range) {
		range = range || 1;
		var count = 0;
		for (var x = obj.x() - range; x < obj.x() + range; x++) {
			for (var y = obj.y() - range; y < obj.y() + range; y++) {
				var o = game.world().tile(x,y,obj.z() || 0);
				if (o && o.type() === type) {
					count++;
				}
			}
		}
		return count;
	},
	capitalizeFirstLetter: function(s) {
		return s.charAt(0).toUpperCase() + s.substr(1, s.length);
	}
};

// END UTILS
// --------------------------------------------------