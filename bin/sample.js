var RestClient = require ("../lib/rest_client");
var routes = require ("./routes");
var config = require("./config");

var sample = function () {

    //Check config.js for the configuration
    //Check routes.js for the routes desired to be generated

    var restClient = new RestClient (config, routes);

    //this is how you initialize
    restClient.init (function () {

        //this namespace, attached with http methods, is now available
        restClient.git.get(function (err, resp, body) {
            console.log(resp.statusCode);
        });

        //And these namespaces
        // restClient.user.get
        // restClient.user.post
        // restClient.user.put
        // restClient.user.del

    });
};

sample();
