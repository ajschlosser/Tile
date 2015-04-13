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