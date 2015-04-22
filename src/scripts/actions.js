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
		name: 'grow',
		action: function(obj){
			var r = Math.random() * 10000;
			if (obj.properties().growth && r > 9950) {
				var g = Math.floor(Math.random() * 9),
					farms = game.utils().hasNeighborOfType(obj, 'farm', 3) * 25 || 1;
				obj.properties()[obj.properties().growth[0]] += g * farms;
			}
		}	
	},
	{
		name: 'info',
		events: ['click'],
		action: function(obj){
			var name = obj.type();
			ui.dialog.title(game.utils().capitalizeFirstLetter(name));
			var content = 'This ' + name + ' has a height of ' + obj.height() + ', a depth of ' + obj.depth() + '. ';
			Tile.tools.keys(obj.properties()).forEach(function(prop){
				if (!Array.isArray(obj.properties()[prop]) && typeof obj.properties()[prop] !== 'object') {
					content += 'It has a ' + prop + ' of ' + obj.properties()[prop] + '. ';
				}
			});
			console.log(game.utils().hasNeighborOfType(obj,'farm',3));
			ui.dialog.content(content);
			ui.dialog.show();
		}
	}
];

// END ACTIONS
// --------------------------------------------------