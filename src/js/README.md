<a name="Tile"></a>
## Tile : <code>object</code>
**Kind**: global namespace  

* [Tile](#Tile) : <code>object</code>
    * [.Engine](#Tile.Engine) : <code>object</code>
        * [.create(params)](#Tile.Engine.create)
            * [~camera](#Tile.Engine.create..camera) : <code>object</code>
            * [~clicks](#Tile.Engine.create..clicks) : <code>array</code>
            * [~states](#Tile.Engine.create..states) : <code>array</code>
            * [~events](#Tile.Engine.create..events) : <code>array</code>
            * [~actions](#Tile.Engine.create..actions) : <code>array</code>
            * [~fps](#Tile.Engine.create..fps) : <code>number</code>
            * [~world](#Tile.Engine.create..world) : <code>object</code>
            * [~templates](#Tile.Engine.create..templates) : <code>object</code>
                * [~load(template, callback)](#Tile.Engine.create..templates..load) ⇒ <code>string</code>
                * [~bind(scope, callback)](#Tile.Engine.create..templates..bind)
            * [~id](#Tile.Engine.create..id) : <code>string</code>
            * [~container](#Tile.Engine.create..container) : <code>HTMLElement</code>
            * [~canvas](#Tile.Engine.create..canvas) : <code>HTMLElement</code>
            * [~buffer](#Tile.Engine.create..buffer) : <code>string</code>
            * [~context](#Tile.Engine.create..context) : <code>CanvasRenderingContext2D</code>
            * [~buffer_ctx](#Tile.Engine.create..buffer_ctx) : <code>CanvasRenderingContext2D</code>
            * [~options](#Tile.Engine.create..options) : <code>object</code>
            * [~tilesize](#Tile.Engine.create..tilesize) : <code>number</code>
            * [~ui](#Tile.Engine.create..ui) : <code>object</code>
            * [~view](#Tile.Engine.create..view) : <code>object</code>
            * [~scopes](#Tile.Engine.create..scopes) : <code>object</code>
            * [~sprites](#Tile.Engine.create..sprites) : <code>object</code>
            * [~spritemaps](#Tile.Engine.create..spritemaps) : <code>object</code>
            * [~utils](#Tile.Engine.create..utils) : <code>object</code>

<a name="Tile.Engine"></a>
### Tile.Engine : <code>object</code>
**Kind**: static namespace of <code>[Tile](#Tile)</code>  

* [.Engine](#Tile.Engine) : <code>object</code>
    * [.create(params)](#Tile.Engine.create)
        * [~camera](#Tile.Engine.create..camera) : <code>object</code>
        * [~clicks](#Tile.Engine.create..clicks) : <code>array</code>
        * [~states](#Tile.Engine.create..states) : <code>array</code>
        * [~events](#Tile.Engine.create..events) : <code>array</code>
        * [~actions](#Tile.Engine.create..actions) : <code>array</code>
        * [~fps](#Tile.Engine.create..fps) : <code>number</code>
        * [~world](#Tile.Engine.create..world) : <code>object</code>
        * [~templates](#Tile.Engine.create..templates) : <code>object</code>
            * [~load(template, callback)](#Tile.Engine.create..templates..load) ⇒ <code>string</code>
            * [~bind(scope, callback)](#Tile.Engine.create..templates..bind)
        * [~id](#Tile.Engine.create..id) : <code>string</code>
        * [~container](#Tile.Engine.create..container) : <code>HTMLElement</code>
        * [~canvas](#Tile.Engine.create..canvas) : <code>HTMLElement</code>
        * [~buffer](#Tile.Engine.create..buffer) : <code>string</code>
        * [~context](#Tile.Engine.create..context) : <code>CanvasRenderingContext2D</code>
        * [~buffer_ctx](#Tile.Engine.create..buffer_ctx) : <code>CanvasRenderingContext2D</code>
        * [~options](#Tile.Engine.create..options) : <code>object</code>
        * [~tilesize](#Tile.Engine.create..tilesize) : <code>number</code>
        * [~ui](#Tile.Engine.create..ui) : <code>object</code>
        * [~view](#Tile.Engine.create..view) : <code>object</code>
        * [~scopes](#Tile.Engine.create..scopes) : <code>object</code>
        * [~sprites](#Tile.Engine.create..sprites) : <code>object</code>
        * [~spritemaps](#Tile.Engine.create..spritemaps) : <code>object</code>
        * [~utils](#Tile.Engine.create..utils) : <code>object</code>

<a name="Tile.Engine.create"></a>
#### Engine.create(params)
Create the Tile engine

**Kind**: static method of <code>[Engine](#Tile.Engine)</code>  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | The params object |


* [.create(params)](#Tile.Engine.create)
    * [~camera](#Tile.Engine.create..camera) : <code>object</code>
    * [~clicks](#Tile.Engine.create..clicks) : <code>array</code>
    * [~states](#Tile.Engine.create..states) : <code>array</code>
    * [~events](#Tile.Engine.create..events) : <code>array</code>
    * [~actions](#Tile.Engine.create..actions) : <code>array</code>
    * [~fps](#Tile.Engine.create..fps) : <code>number</code>
    * [~world](#Tile.Engine.create..world) : <code>object</code>
    * [~templates](#Tile.Engine.create..templates) : <code>object</code>
        * [~load(template, callback)](#Tile.Engine.create..templates..load) ⇒ <code>string</code>
        * [~bind(scope, callback)](#Tile.Engine.create..templates..bind)
    * [~id](#Tile.Engine.create..id) : <code>string</code>
    * [~container](#Tile.Engine.create..container) : <code>HTMLElement</code>
    * [~canvas](#Tile.Engine.create..canvas) : <code>HTMLElement</code>
    * [~buffer](#Tile.Engine.create..buffer) : <code>string</code>
    * [~context](#Tile.Engine.create..context) : <code>CanvasRenderingContext2D</code>
    * [~buffer_ctx](#Tile.Engine.create..buffer_ctx) : <code>CanvasRenderingContext2D</code>
    * [~options](#Tile.Engine.create..options) : <code>object</code>
    * [~tilesize](#Tile.Engine.create..tilesize) : <code>number</code>
    * [~ui](#Tile.Engine.create..ui) : <code>object</code>
    * [~view](#Tile.Engine.create..view) : <code>object</code>
    * [~scopes](#Tile.Engine.create..scopes) : <code>object</code>
    * [~sprites](#Tile.Engine.create..sprites) : <code>object</code>
    * [~spritemaps](#Tile.Engine.create..spritemaps) : <code>object</code>
    * [~utils](#Tile.Engine.create..utils) : <code>object</code>

<a name="Tile.Engine.create..camera"></a>
##### create~camera : <code>object</code>
Position of the camera, which is the center of the view

**Kind**: inner property of <code>[create](#Tile.Engine.create)</code>  
**Default**: <code>{
            x: Math.floor(canvas.width / tilesize / 2),
            y: Math.floor(canvas.height / tilesize / 2)
          }</code>  
<a name="Tile.Engine.create..clicks"></a>
##### create~clicks : <code>array</code>
An array of click events

**Kind**: inner property of <code>[create](#Tile.Engine.create)</code>  
<a name="Tile.Engine.create..states"></a>
##### create~states : <code>array</code>
An array of custom states

**Kind**: inner property of <code>[create](#Tile.Engine.create)</code>  
**Default**: <code>[]</code>  
<a name="Tile.Engine.create..events"></a>
##### create~events : <code>array</code>
An object that has arrays of mouse input events as properties

**Kind**: inner property of <code>[create](#Tile.Engine.create)</code>  
**Default**: <code>{ click: [], mousemove: [] }</code>  
<a name="Tile.Engine.create..actions"></a>
##### create~actions : <code>array</code>
An object that has custom action methods as properties

**Kind**: inner property of <code>[create](#Tile.Engine.create)</code>  
<a name="Tile.Engine.create..fps"></a>
##### create~fps : <code>number</code>
The game's set frames-per-second

**Kind**: inner property of <code>[create](#Tile.Engine.create)</code>  
**Default**: <code>60</code>  
<a name="Tile.Engine.create..world"></a>
##### create~world : <code>object</code>
The game's world, created by calling Tile.World.create

**Kind**: inner property of <code>[create](#Tile.Engine.create)</code>  
<a name="Tile.Engine.create..templates"></a>
##### create~templates : <code>object</code>
Namespace for managing templates

**Kind**: inner namespace of <code>[create](#Tile.Engine.create)</code>  

* [~templates](#Tile.Engine.create..templates) : <code>object</code>
    * [~load(template, callback)](#Tile.Engine.create..templates..load) ⇒ <code>string</code>
    * [~bind(scope, callback)](#Tile.Engine.create..templates..bind)

<a name="Tile.Engine.create..templates..load"></a>
###### templates~load(template, callback) ⇒ <code>string</code>
Load a template with a GET request

**Kind**: inner method of <code>[templates](#Tile.Engine.create..templates)</code>  
**Returns**: <code>string</code> - Respnse XML  

| Param | Type | Description |
| --- | --- | --- |
| template | <code>string</code> | Template file |
| callback | <code>callback</code> | Callback executed when the template loads |

<a name="Tile.Engine.create..templates..bind"></a>
###### templates~bind(scope, callback)
Bind a scope to a template

**Kind**: inner method of <code>[templates](#Tile.Engine.create..templates)</code>  

| Param | Type | Description |
| --- | --- | --- |
| scope | <code>object</code> | Template scope object |
| callback | <code>callback</code> | Callback executed on the bound scope |

<a name="Tile.Engine.create..id"></a>
##### create~id : <code>string</code>
The id attribute of the containing div

**Kind**: inner constant of <code>[create](#Tile.Engine.create)</code>  
**Default**: <code>&quot;container&quot;</code>  
<a name="Tile.Engine.create..container"></a>
##### create~container : <code>HTMLElement</code>
The div that contains the canvas element

**Kind**: inner constant of <code>[create](#Tile.Engine.create)</code>  
**Default**: <code>Creates a div element</code>  
<a name="Tile.Engine.create..canvas"></a>
##### create~canvas : <code>HTMLElement</code>
The main canvas element

**Kind**: inner constant of <code>[create](#Tile.Engine.create)</code>  
**Default**: <code>Creates a canvas element that gets appended to the container</code>  
<a name="Tile.Engine.create..buffer"></a>
##### create~buffer : <code>string</code>
The canvas buffer

**Kind**: inner constant of <code>[create](#Tile.Engine.create)</code>  
**Default**: <code>&quot;Creates a canvas element that gets appended to the container&quot;</code>  
<a name="Tile.Engine.create..context"></a>
##### create~context : <code>CanvasRenderingContext2D</code>
Context of the main canvas element

**Kind**: inner constant of <code>[create](#Tile.Engine.create)</code>  
<a name="Tile.Engine.create..buffer_ctx"></a>
##### create~buffer_ctx : <code>CanvasRenderingContext2D</code>
Context of the canvas buffer

**Kind**: inner constant of <code>[create](#Tile.Engine.create)</code>  
<a name="Tile.Engine.create..options"></a>
##### create~options : <code>object</code>
An object with options as properties

**Kind**: inner constant of <code>[create](#Tile.Engine.create)</code>  
**Default**: <code>{}</code>  
<a name="Tile.Engine.create..tilesize"></a>
##### create~tilesize : <code>number</code>
Tile size in pixels

**Kind**: inner constant of <code>[create](#Tile.Engine.create)</code>  
**Default**: <code>16</code>  
<a name="Tile.Engine.create..ui"></a>
##### create~ui : <code>object</code>
An object with GUI template objects as properties

**Kind**: inner constant of <code>[create](#Tile.Engine.create)</code>  
**Default**: <code>{}</code>  
<a name="Tile.Engine.create..view"></a>
##### create~view : <code>object</code>
Size of the viewable area of the game world

**Kind**: inner constant of <code>[create](#Tile.Engine.create)</code>  
**Default**: <code>{
            width: Math.floor(canvas.width / tilesize),
            height: Math.floor(canvas.height / tilesize)
          }</code>  
<a name="Tile.Engine.create..scopes"></a>
##### create~scopes : <code>object</code>
An object that has scopes that are bound to GUI templates as properties

**Kind**: inner constant of <code>[create](#Tile.Engine.create)</code>  
<a name="Tile.Engine.create..sprites"></a>
##### create~sprites : <code>object</code>
An object that has sprite objects as properties

**Kind**: inner constant of <code>[create](#Tile.Engine.create)</code>  
<a name="Tile.Engine.create..spritemaps"></a>
##### create~spritemaps : <code>object</code>
An object that has spritemap objects as properties

**Kind**: inner constant of <code>[create](#Tile.Engine.create)</code>  
<a name="Tile.Engine.create..utils"></a>
##### create~utils : <code>object</code>
An object that has custom utility methods as properties

**Kind**: inner constant of <code>[create](#Tile.Engine.create)</code>  
**Default**: <code>{}</code>  
