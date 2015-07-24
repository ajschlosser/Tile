/*
	Optional express server for Tile
*/

var express = require("express"),
	hostname = process.env.HOSTNAME || 'localhost',
	port = parseInt(process.env.PORT, 10) || 3001,
	app = express();

app.get('/', function (req, res) {
	res.redirect('/index.html');
});

app.use(express.static(__dirname + '/dist'));

console.log('Tile server listening at http://%s:%s', hostname, port);
app.listen(port, hostname);