//Imports
var cve_json = require('../data/nvdcve-1.0-2017.json');

//Functions
var get_cve = function(cve, cb){
    for(var i = 0; i < cve_json["CVE_Items"].length; i++){
        var vuln = cve_json['CVE_Items'][i]['cve'];
        var vuln_id = vuln['CVE_data_meta']['ID'];

        if(vuln_id === cve){

            var desc = vuln["description"]["description_data"][0]["value"];

            var vuln_prod_list = new Set();
            var vendor_data = vuln['affects']['vendor']['vendor_data'];
            for(l = 0; l < vendor_data.length; l++){
                var product_data = vendor_data[l]['product']['product_data'];
                for(m = 0; m < product_data.length; m++){
                    var vuln_product = product_data[m]["product_name"];
                    vuln_prod_list.add(vuln_product);
                }
            }

            cb(cve, desc, Array.from(vuln_prod_list));
            return;

        }
    }
    cb(null, null, null);
}

var to_export = {
    get_cve : get_cve
};

module.exports = to_export;
