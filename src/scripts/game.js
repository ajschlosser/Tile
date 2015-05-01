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
		width: 500,
		height: 500
	}
});

game.run();

// END GAME
// --------------------------------------------------