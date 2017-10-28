var assert = require('assert');

//Modules to test
var cve_search = require('./command_helpers/read_cve.js');
var reddit_search = require('./command_helpers/get_netsec.js');
var aws_state = require('./command_helpers/aws_monitor.js');

//Tests for vuln descriptions
describe('CVE Identifier Tests', function(){
    it('CVE stays consistent', function(){
        cve_search.get_cve('CVE-2017-10111', function(id, desc, vuln_prod_lists){
            assert.equal('CVE-2017-10111', id); 
        });
    });

    var vuln_desc = "The function named ReadICONImage in coders\\icon.c " +
    "in ImageMagick 7.0.5-5 has a memory leak vulnerability which can cause" +
    " memory exhaustion via a crafted ICON file.";

    it('Description matches cve data file description', function(){
        cve_search.get_cve('CVE-2017-8765', function(id, desc, vuln_prod_lists){
            assert.equal(vuln_desc, desc); 
        });
    });

    it("Proper vulnerable products", function(){
        cve_search.get_cve('CVE-2017-8765', function(id, desc, vuln_prod_lists){
            assert.equal('imagemagick', vuln_prod_lists); 
        });
    });

    it("Work even with lowercase cve", function(){
        cve_search.get_cve('cve-2017-8765', function(id, desc, vuln_prod_lists){
            assert.equal('imagemagick', vuln_prod_lists); 
            assert.equal(vuln_desc, desc); 
        });
    }); 

    it("Return nulls on bad input", function(){
        cve_search.get_cve('bad input', function(id, desc, vuln_prod_lists){
            assert.equal(null, vuln_prod_lists); 
            assert.equal(null, desc); 
        });
    })
});

describe('Reddit NetSec Search Tests', function(){
    it('Returns at most 3 results', function(){
        reddit_search.get_reddit_results('security', function(results){
            assert.equal(3, results.length);
        });
    });

    it('Returns an empty list when no results found', function(){
        reddit_search.get_reddit_results('asdflkasjdf;alkjf12341234', function(results){
            assert.equal([], results);
        });
    });

    it('Returns objects with title, url, created and no other keys', function(){
        reddit_search.get_reddit_results('security', function(results){
            for(var i = 0; i < results.length; i++){
                var result = results[i];
                console.log(results);
                assert.equal(new Set(['title', 'url', 'created']), new Set(result.keys()));
            }
        });
    });
});

describe('AWS Status Tests', function(){

});