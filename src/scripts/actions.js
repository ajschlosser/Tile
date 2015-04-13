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
		events: ['click'],
		action: function(obj){
			console.log(obj.properties(), obj.depth());
			console.log('height', obj.height());
		}	
	},
	{
		name: 'info2',
		types: ['water', 'grass'],
		events: ['dblclick'],
		action: function(obj){
			var height = obj.height();
			obj.height(height-1);
		}	
	}
];

// END ACTIONS
// --------------------------------------------------