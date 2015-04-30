// --------------------------------------------------
// BEGIN GAME

var game = Tile.Engine.create({
	width: 640,
	height: 480,
	tilesize: 32,
	utils: utils,
	ui: ui,
	types: types,
	sprites: sprites,
	actions: actions,
	world: {
		width: 300,
		height: 300
	}
});

game.run();

// END GAME
// --------------------------------------------------