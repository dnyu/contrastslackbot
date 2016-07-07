//Load node modules
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var cors = require('cors');

//Load Dependencies
var routes = require('./routes/routes.js');
var envvars = require('./configsvars.js');

//Setup Server
var ipaddress = envvars.ipaddress;
var port = envvars.port; 

//Create Server
var app = express();

//Configure Server
//* Parsing for parsing requests
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
})); 

//*Allow CORS
//Should delete this later
app.all('/*', function(req, res, next) {
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

//Public files
app.use(express.static('public'));	//Let's all files in public be viewed through urls

//*Set Views
app.set('views', path.join(__dirname, 'views'));	//Automatically detects views dir 
app.set('view engine', 'ejs');	//All views should use ejs instead of html

//*Set Routes
app.use('/', routes);	//Sets routes to the / after home url

//Start Server
console.log('Setup Complete');
app.listen(port, function() {
          console.log('%s: Node server started on %s:%d ...',
                      Date(Date.now() ), ipaddress, port);
      });
console.log('nodenow nodejs boilerplate developed by Don Yu');
console.log('Server started: Listening on port ' + port);
