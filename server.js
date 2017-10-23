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
var reddit_search = require('./command_helpers/get_netsec.js');

//Helper functions
var print_synchronous = function(message, results, counter){
    if(counter >= results.length){
        return
    }
    else{
        var title = (results[counter]['title'] != null) ? results[counter]['title'] : "No title!";
        var url = (results[counter]['url'] != null) ? results[counter]['url'] : "No link!";
        var date = (results[counter]['date'] != null) ? results[counter]['date'] : "No date for post found!";
        bot.reply(message, 'Title: ' + title, function(){
            bot.reply(message, 'Link: ' + url, function(){
                bot.reply(message, 'Date: ' + date, print_synchronous(message, results, counter + 1));
            });
        });
    }   
}

//Bot service
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

controller.hears(['vuln (.*)'], 'direct_message,direct_mention,mention', function(bot, message) {
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

controller.hears(['netsec (.*)'], 'direct_message,direct_mention,mention', function(bot, message) {
    var search = message.match[1];
    reddit_search.get_reddit_results(search, function(results){
        print_synchronous(message, results, 0);
    });
});