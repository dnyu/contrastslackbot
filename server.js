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

//Imports for functionality
var cve_search = require('./command_helpers/read_cve.js');

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
        timestconsoamp: message.ts,
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

controller.hears(['lookup (.*)'], 'direct_message,direct_mention,mention', function(bot, message) {
    var cve = message.match[1];
    cve_search.get_cve(cve, function(id, desc, vuln_prod_list){
        if(id != null){
            if(desc != null){
                bot.reply(message, desc, function(){
                    if(vuln_prod_list != null){
                        bot.reply(message, vuln_prod_list.join(', '));
                    }
                    else{
                        bot.reply(message, "No list of vulnerable products found for " + id);
                    }
                });
            }
            else{
                bot.reply(message, "No description found for " + id);
            }
        }
        else{
            bot.reply(message, "CVE not found!");
        }
    });
});