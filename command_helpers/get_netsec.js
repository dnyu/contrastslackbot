var request = require('request');

var get_reddit_results = function(term, cb){
    var term_encoded = encodeURI(term);
    var req_url = 'https://www.reddit.com/search.json?q=title:' 
                            + term_encoded + '+subreddit:netsec&limit=3&sort=new';
    request(req_url, function(err, res, body){
        if(!err && res.statusCode == 200){
            var results = JSON.parse(body)['data']['children'];
            var formatted_results = [];

            for(var i = 0; i < results.length; i++){
                var curr_result = results[i];
                var stickied = curr_result['data']['stickied'];
                var nsfw = curr_result['data']['nsfw'];
                var is_netsec = curr_result['data']['subreddit'] == 'netsec';

                var result_output = {};
                if(!stickied && !nsfw && is_netsec){
                    result_output['title'] = curr_result['data']['title'];
                    result_output['url'] = curr_result['data']['url'];
                    result_output['date'] = new Date(curr_result['data']['created'] * 1000);
                    //Convert epoch to readable time
                    formatted_results.push(result_output); 
                }
            }
            var results_ordered = formatted_results.reverse();
            cb(results_ordered);
        }
        else{   //Case where GET request did not complete successfully
            cb([]);
        }
    });    
}

var to_export = {
    get_reddit_results : get_reddit_results
};

module.exports = to_export;