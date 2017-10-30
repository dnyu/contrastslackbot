//Load node modules
var Botkit = require('botkit');

//Imports for functionality
var envvars = require('./config.json');
var cve_search = require('./command_helpers/read_cve.js');
var reddit_search = require('./command_helpers/get_netsec.js');
var aws_state = require('./command_helpers/aws_monitor.js');

//Bot service
if (!envvars["slackAPIKey"]) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var controller = Botkit.slackbot({
    debug: true,
    require_delivery: true,
    send_via_rtm: true
});

var bot = controller.spawn({
    token: envvars["slackAPIKey"]
}).startRTM();

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

//Listeners
controller.hears(['help', 'commands'], 'direct_message, direct_mention, mention', function(bot, message){
    var help_string = '----------------------------------------- \n' +
                      '\"aws\" : pings AWS server for 10 most recent events from CloudTrail \n' +
                      '\"vuln CVE-2017-xxxx\" : Replace xxxx with valid CVE code' +
                      ' to get description and vulnerable systems if applicable \n' +
                      '\"netsec arg\" : Type netsec and then any search term(s) to grab the latest articles relevent to the search terms \n' +
                      '\"b64 arg\" : Type b64 then any Base64 encoded string to immediately get a decoded response \n' +
                      '-----------------------------------------'  
    bot.reply(message, {
        text : help_string
    });
});

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
        if(results.length == 0){
            bot.reply(message, "No results found!");
        }
        else{
            print_synchronous(message, results, 0);
        }
    });
});

controller.hears(['aws'], 'direct_message,direct_mention,mention', function(bot, message){
    aws_state.get_ct_state(function(events){
        if(events == null){
            bot.reply(message, "No events found, ensure AWS SDK properly configured");
        }
        else{
            print_events(message, events, 0);
        }
    });
});

controller.hears(['b64 (.*)'], 'direct_message,direct_mention,mention', function(bot, message){
    var to_decode = new Buffer(message.match[1], 'base64');
    var decoded = to_decode.toString();
    bot.reply(message, "Message decoded from Base64: " + decoded);
});


var to_export = {
    print_sync : print_synchronous,
    print_events : print_events
}

module.exports = to_export