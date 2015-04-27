// --------------------------------------------------
// BEGIN GAME

var game = Tile.Engine.create({
	w: 640,
	h: 480,
	tilesize: 64,
	utils: utils,
	ui: ui,
	types: types,
	sprites: sprites,
	actions: actions,
	world: {
		width: 50,
		height: 50
	}
});

game.run();

// END GAME
// --------------------------------------------------