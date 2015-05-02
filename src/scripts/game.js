// --------------------------------------------------
// BEGIN GAME

var game = Tile.Engine.create({
	width: 640,
	height: 480,
	tilesize: 24,
	utils: utils,
	ui: ui,
	types: types,
	sprites: sprites,
	actions: actions,
	world: {
		width: 250,
		height: 250
	}
});

game.run();

// END GAME
// --------------------------------------------------