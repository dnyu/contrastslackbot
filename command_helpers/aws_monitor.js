var AWS = require('aws-sdk');

AWS.config.loadFromPath('./config.json');

var cloudtrail = new AWS.CloudTrail();

var query = {"MaxResults" : 10} //Actual query to pull information from CloudTrail

var get_ct_state = function(cb){
    cloudtrail.lookupEvents(query, function(err,data){
        if (err) {              //AWS SDK handles errors for querying AWS
            console.log("Error", err);
            cb(null);           //Log error, catch with null
          } 
        else {
            var events = [];
            for(var i = 0; i < data['Events'].length; i++){     //Collect information per event
                var add_event = {}
                var body = data['Events'][i]; 
                add_event['name'] = body['EventName'];
                add_event['time'] = body['EventTime'];
                add_event['user'] = body['Username'];
                add_event['location'] = JSON.parse(body['CloudTrailEvent'])['sourceIPAddress'];
                events.push(add_event);
            }
            var events_ordered = events.reverse();
            cb(events_ordered);
        }
    });   
}

var to_export = {
    get_ct_state : get_ct_state
};

module.exports = to_export;