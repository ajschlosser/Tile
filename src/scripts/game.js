// --------------------------------------------------
// BEGIN GAME

var game = Tile.Engine.create({
	w: 640,
	h: 480,
	tilesize: 32,
	utils: utils,
	ui: ui,
	types: types,
	sprites: sprites,
	actions: actions
});

game.run();

// END GAME
// --------------------------------------------------