// --------------------------------------------------
// BEGIN GAME

var game = Tile.Engine.create({
	width: 640,
	height: 480,
	tilesize: 4,
	utils: utils,
	ui: ui,
	types: types,
	sprites: sprites,
	actions: actions,
	world: {
		width: 100,
		height: 100
	}
});

game.run();

// END GAME
// --------------------------------------------------