/*Managed policy
AWSCloudTrailReadOnlyAccess
Managed policy
CloudWatchReadOnlyAccess
Managed policy
CloudWatchEventsReadOnlyAccess*/

var AWS = require('aws-sdk');

AWS.config.loadFromPath('./aws_config.json');

var cloudtrail = new AWS.CloudTrail();

var query = {
                "MaxResults" : 10
            }

var get_ct_state = function(cb){
    cloudtrail.lookupEvents(query, function(err,data){
        if (err) {
            console.log("Error", err);
            cb(null);
          } 
        else {
            var events = [];
            for(var i = 0; i < data['Events'].length; i++){
                var add_event = {}
                var body = data['Events'][i]; 
                add_event['name'] = body['EventName'];
                add_event['time'] = body['EventTime'];
                add_event['user'] = body['Username'];
                add_event['location'] = JSON.parse(body['CloudTrailEvent'])['sourceIPAddress'];
                add_event['resources'] = body['Resources'];
                events.push(add_event);
            }
            cb(events);
        }
    });   
}

var to_export = {
    get_ct_state : get_ct_state
};

module.exports = to_export;