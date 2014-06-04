// Modules
var fs = require("fs");
var express = require("express");

// Configuration
var config = JSON.parse(fs.readFileSync("data/config.json"));
var port = config.port || 3000;

// Create express app
var app = express();

// Send index html file when root is requested
app.get("/", function(request, response){
	console.log("you've hit /");
	response.status(200).send("Hey baby, this updates well? Oh it does.");
});

// Make every static file in ./public available
//app.use(express.static(__dirname + '/public'));

// Run Server - note that it is set up to run with stagecoach on production server, but default port is used locally
try
{
  // In production get the port number from stagecoach
  port = fs.readFileSync(__dirname + '/data/port', 'UTF-8').replace(/\s+$/, '');
} catch (err)
{
  // This is handy in a dev environment
  console.log("I see no data/port file, defaulting to port " + port);
}
console.log("Listening on port " + port);
app.listen(port);