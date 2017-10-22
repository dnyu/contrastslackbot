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
/*
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
*/

if (!envvars.api_key) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var Botkit = require('botkit');
var os = require('os');

var controller = Botkit.slackbot({
    debug: true,
});

var bot = controller.spawn({
    token: envvars.api_key
}).startRTM();

controller.hears(['hello', 'hi'], 'direct_message,direct_mention,mention', function(bot, message) {

    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'robot_face',
    }, function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(', err);
        }
    });


    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Hello ' + user.name + '!!');
        } else {
            bot.reply(message, 'Hello.');
        }
    });
});