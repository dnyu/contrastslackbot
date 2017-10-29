//Load node modules
var bodyParser = require('body-parser');
var path = require('path');

//Imports for functionality
var envvars = require('./config.json');
var cve_search = require('./command_helpers/read_cve.js');
var reddit_search = require('./command_helpers/get_netsec.js');
var aws_state = require('./command_helpers/aws_monitor.js');

//Helper functions
var print_synchronous = function(message, results, counter){
    if(results.length == 0){
        bot.reply(message, 'No results found!');
        return
    }
    if(counter >= results.length){
        return
    }
    else{
        var title = (results[counter]['title'] != null) ? results[counter]['title'] : "No title!";
        var url = (results[counter]['url'] != null) ? results[counter]['url'] : "No link!";
        var date = (results[counter]['date'] != null) ? results[counter]['date'] : "No date for post found!";
        bot.reply(message, {
                                text : '----------------------------------------- \n Title: ' + title + 
                                    '\n Date: ' + date + 
                                    '\n Link: ' + url +
                                    '\n'
                            }, print_synchronous(message, results, counter + 1));
    } 
}

var print_events = function(message, events, counter){
    if(events.length == 0){
        bot.reply(message, 'No AWS events found!');
    }
    if(counter >= events.length){
        return
    }
    else{
        var curr_event = events[counter];
        var event_string = '-------------------------------------- \n' +
                           'Time: ' + curr_event['time'] + '\n' + 
                           'Event: ' + curr_event['name'] + '\n' +
                           'User: ' + curr_event['user'] + '\n' +
                           'IP: ' + curr_event['location'];
        bot.reply(message, {
                        text : event_string
        }, print_events(message, events, counter + 1));
    }
}

//Bot service
if (!envvars["slackAPIKey"]) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var Botkit = require('botkit');

var controller = Botkit.slackbot({
    debug: true,
    require_delivery: true,
    send_via_rtm: true
});

var bot = controller.spawn({
    token: envvars["slackAPIKey"]
}).startRTM();

controller.hears(['vuln (.*)'], 'direct_message,direct_mention,mention', function(bot, message) {
    var cve = message.match[1];
    if(cve == null){
        bot.reply(message, "Add CVE as input argument!");
    }
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
    console.log(message.match);
    if(search == null){
        bot.reply(message, "Add search term as input argument!");
    }
    reddit_search.get_reddit_results(search, function(results){
        print_synchronous(message, results, 0);
    });
});

controller.hears(['aws'], 'direct_message,direct_mention,mention', function(bot, message){
    aws_state.get_ct_state(function(events){
        var events_ordered = events.reverse()
        print_events(message, events_ordered, 0);
    });
});