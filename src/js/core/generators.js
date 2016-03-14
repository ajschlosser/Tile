var generators = {
  '*': function(options, callback) {
    var width = game.world().width();
    var height = game.world().height();
    var tiles = game.world().tiles();
    var player = game.world().player();
    var types = game.world().types();
    var properties = game.world().properties;
    var self = game.world();
    for (var x = 0; x < width; x++) {
      tiles[0][x] = [];
      for (var y = 0; y < height; y++) {
        var r = Math.random()*1000,
          type;
        if (r < 850) {
          type = 'grass';
        } if (r >= 850) {
          type = 'meadow';
        } if (r >= 900) {
          type = 'farm';
        } if (r >= 950) {
          type = 'water';
        } if (r > 995) {
          type = 'town';
        }
        var tile = Tile.Obj.create({
          x : x,
          y : y,
          type : type,
          height : 7,
          depth : type === 'water' ? 2 : 0,
          properties : properties(type)
        });
        if (tile.properties().persistent) {
          tiles.persistent.push([tile.x(), tile.y()]);
        }
        tiles[0][x][y] = tile;
      }
    }
    var status;
    self.everywhere([
      function(x, y, process){
        $.run(function(){
          var t = tiles[0][x][y],
            type = t.type(),
            n = Tile.Obj.hasNeighborOfType,
            water = n(t, 'water', 2),
            grass = n(t, 'grass', 1),
            town = n(t, 'town', 12);
          if (water > 3) {
            self.transform(t).to('water');
            t.depth(3);
          } else if (type === 'water') {
            self.transform(t).to('grass');
          }
          if (type !== 'town' && n(t, 'town', 1)) {
            self.transform(t).to('farm');
          }
          if (type === 'town' && town > 1) {
            self.transform(t).to('grass');
          }
        });
      },
      function(x, y, process){
        $.run(function(){
          var t = tiles[0][x][y],
            type = t.type(),
            n = Tile.Obj.hasNeighborOfType,
            water = n(t, 'water', 4),
            grass = n(t, 'grass', 1);
          if ((type === 'grass' || type === 'meadow') && grass < 5) {
            self.transform(t).to('water');
            t.depth(1);
          }
          if (type === 'farm' && !n(t, 'town', 2)) {
            self.transform(t).to('grass');
          }
        });
      }
    ], 3, function(){
      callback();
    });
  }
};
