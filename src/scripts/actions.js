// --------------------------------------------------
// BEGIN ACTIONS

var actions = [
	{
		name: 'wetten',
		types: ['grass', 'water'],
		action: function(obj){
			if (obj.properties().wetness >= 4) {
				obj.type('water');
			} else {
				//obj.type('grass');
			}
		}	
	},
	{
		name: 'flood',
		types: ['water'],
		action: function(obj){
			var neighbor = game.utils().getRandomNeighborOf(obj);
			if (neighbor && neighbor.depth() >= obj.depth()) {
				if (neighbor.properties().wetness < 4) {
					neighbor.properties().wetness += 1;
				}
			}
		}
	},
	{
		name: 'info',
		types: ['water', 'grass'],
		events: ['click'],
		action: function(obj){
			var depth = obj.depth();
			obj.depth(depth+1);
			console.log(obj.properties(), obj.depth());
		}	
	}
];

// END ACTIONS
// --------------------------------------------------