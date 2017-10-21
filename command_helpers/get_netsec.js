var request = require('request');

request('https://www.reddit.com/r/netsec/search.json?q=bitcoin&count=5', function(err, res, body){
    if(!err && res.statusCode == 200){
        console.log(JSON.parse(body)['data']['children'].length);
    }
});