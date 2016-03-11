# Tile
A 2D JavaScript tile engine for the HTML5 canvas. Potentially useful for RPGs, roguelikes, and simulation games in the 2D overhead style. Meant to be extensible and easy-to-use.

The main idea behind Tile is extensibility. By providing a simple interface into the engine, it is easy to add custom objects, events, behaviors, and the like. Want to center the map on the coordinates of a mouse click? That's easy -- just add a custom method to the ``actions`` array in ``actions.js``:

```javascript
// This is just an example
{
  name: 'move', // Give the action a unique name
  events: ['click'], // Associate it with a DOM event
  action: function(obj){
    // The obj parameter is always a reference to the object
    // (in this case, a tile) associated with the action or event
    var x = obj.x(),
      y = obj.y(),
      w = game.world().width(),
      h = game.world().height(),
      view = {
        width: Math.floor(game.view().width/2),
        height: Math.floor(game.view().height/2)
      };
    if (x + view.width > w) {
      x = w - view.width;
    }
    if (x - view.width < 0) {
      x = view.width;
    }
    if (y + view.height > h) {
      y = h - view.height -1;
    }
    if (y - view.height < 0) {
      y = view.height;
    }
    game.camera({
      x: x,
      y: y
    });
  }
},
```

Think that method is stupid? Fine. Make your own. It will be passed an ``obj`` parameter representing the tile being evaluated by the engine in the game loop. Then just add this action to the appropriate object type defined as a property of the ``types`` object in ``types.js``:

```javascript
// The '*' property is special and applies to all game objects
'*': {
  actions: ['move']
}
```

You can use this for user inputs, object behaviors (want water tiles to flood grass tiles? just create a method for it). The engine will execute the behavior you define when it's appropriate. The goal of Tile is to give you the freedom to customize how the engine behaviors while doing the work of the engine for you (and as efficiently as possible). It's up to you to add the functionality that you want and to optimize it as best you can.

## Installation

Tile uses [Node.js](https://nodejs.org/en/) and [gulp](http://gulpjs.com/) for development. If you have these on your system, compiling the source for distribution is easy. In the project's root directory, first run ``npm install`` and then ``gulp dist``. A very simple web server is also included so that you can see the project in action. Run it with ``node server`` and then navigate to http://localhost:3001.

## Development

To develop Tile, simply run ``gulp`` after you have installed all of the Node.js dependencies. This will watch your files for changes and automatically compile them. If you run the web server while doing this, you can easily refresh the page to see your changes reflected. If you wanted to, you could use your own build and development tools.

## Structure

Within the ``src`` directory, there are multiple folders.

```
|-- src
|   |-- art
|   |-- conf
|   |-- fonts
|   |-- js
|   |   |-- core
|   |   |-- engine
|   |   |   |-- obj
|   |   |   |-- sprite
|   |   |   |-- tools
|   |   |   |-- world
|   |-- styles
|   |-- templates
```

Here's what they contain:

* ``art`` - image files for tiles and sprites
* ``conf`` - configuration file for gulp; tells gulp which folders and files to watch
* ``fonts`` - font files for text
* ``js\core`` - extensible interfaces into the tile engine; this is where you can add custom objects, events, and tweak behavior
* ``js\engine`` - the tile engine itself
* ``js\engine\obj`` - interface for manipulating game objects
* ``js\engine\sprite`` - interface for drawing sprites
* ``js\engine\tools`` - utility methods used throughout the code
* ``js\engine\world`` - world generation
* ``fonts`` - css for web page and gui
* ``templates`` - gui templates

## Demo

To play with a working demo (although not necessarily the latest build), [click here](http://www.aaronschlosser.com/demo/Tile/dist).
