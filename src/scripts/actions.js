// --------------------------------------------------
// BEGIN ACTIONS

var actions = [
	{
		name: 'wetten',
		types: ['grass', 'water'],
		action: function(obj){
			if (obj.properties().wetness >= 4) {
				obj.type('water');
				obj.properties().flows = true;
			}
		}	
	},
	{
		name: 'flood',
		types: ['water'],
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
		name: 'info',
		types: ['water', 'grass'],
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
	}
];

// END ACTIONS
// --------------------------------------------------