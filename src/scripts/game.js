var game = Tile.Engine.create({
	w: 640,
	h: 480,
	tilesize: 16,
	utils: utils,
	sprites: sprites,
	actions: actions
});

game.run();