var RestClient = require ("../lib/rest_client");
var config = require("./config");

var sample = function () {

    //Check config.js for the configuration
    //Check routes.js for the routes desired to be generated

    var restClient = new RestClient (config);

    //this is how you initialize
    restClient.init (function () {

        //this namespace restClient.git is now available
        restClient.git.findBy(function (err, resp, body) {
            console.log(resp.statusCode);
        });

        //And these namespaces
        // restClient.user.findBy
        // restClient.user.create
        // restClient.user.update
        // restClient.user.deleteBy

    });
};

sample();
