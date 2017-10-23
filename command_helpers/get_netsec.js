var request = require('request');

var get_reddit_results = function(term, cb){
    var term_encoded = encodeURI(term);
    var req_url = 'https://www.reddit.com/search.json?q=title:' 
                            + term_encoded + '+subreddit:netsec&limit=3&sort=relevance';
    request(req_url, function(err, res, body){
        if(!err && res.statusCode == 200){
            var results = JSON.parse(body)['data']['children'];
            var upper_lim = (3 < results.length) ? 3 : results.length;

            var formatted_results = [];

            for(var i = 0; i < upper_lim; i++){
                var curr_result = results[i];
                var stickied = curr_result['data']['stickied'];

                var result_output = {};
                if(!stickied){
                    result_output['title'] = curr_result['data']['title'];
                    result_output['url'] = curr_result['data']['url'];
                    result_output['date'] = new Date(curr_result['data']['created'] * 1000);

                    formatted_results.push(result_output); 
                }
            }
            cb(formatted_results);
        }
        else{
            cb([]);
        }
    });    
}

var to_export = {
    get_reddit_results : get_reddit_results
};

module.exports = to_export;