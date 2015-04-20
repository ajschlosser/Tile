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
			var name = obj.type();
			ui.dialog.title(game.utils().capitalizeFirstLetter(name));
			ui.dialog.content('This ' + name + ' has a height of ' + obj.height() + ', a depth of ' + obj.depth() + ', and a wetness of ' + obj.properties().wetness + '.');
			ui.dialog.show();
		}
	}
];

// END ACTIONS
// --------------------------------------------------