var NamespaceFactory = require('./namespace_factory');
var ResourceClient = require('./resource_client');
var request = require ('request');

var RestClient = function (conf) {
    var resourceClients = [];
    var config = conf;

    this.getConfig = function () {
        return config;
    };

    this.addResourceClient = function (rClient) {
        resourceClients.push(rClient);
    };

    this.getResourceClients = function ()  {
        return resourceClients;
    };
};

var authenticate = function (authOptions, callback) {
    request.post(authOptions.uri + authOptions.authPath, {

        form : authOptions.credentials,
        strictSSL: false,
        rejectUnauthorized: false

    }, function (err, resp, body) {
        if (!err) {

            if (resp.headers['set-cookie']) {
                var headerCookie = resp.headers['set-cookie'][0];

                //parse the cookie declared by the header and
                //save it as a request cookie
                var cookie = headerCookie.split(";")[0];
                cookie = request.cookie(cookie);

                //create a new request cookie jar to store the cookie
                //the new cookie jar will be passed as a default cookie
                //jar for all of our requests
                var cookieJar = request.jar();
                cookieJar.add(cookie);

                //override our request object with the new options
                request = request.defaults ({
                    strictSSL: false,
                    rejectUnauthorized: false,
                    jar: cookieJar
                });
            }
            callback(err, resp, body);

        } else {
            throw err;
        }
    });

};

RestClient.prototype.changePath = function (path) {
    if (typeof path !== 'string') {
        throw new TypeError("Parameter path should be a string.");
    }

    var resourceClients = this.getResourceClients();

    for (var i = 0; i <  resourceClients.length; i++) {
        resourceClients[i].basePath = path;
    }
};

RestClient.prototype.resetPath = function () {
    var resourceClients = this.getResourceClients();

    for (var i = 0; i <  resourceClients.length; i++) {
        resourceClients[i].basePath = "";
    }
};

RestClient.prototype.init = function (callback) {

    var self = this;

    var baseUri = this.getConfig().uri;
    var basePath = this.getConfig().basePath;
    var namespaceFactory  = new NamespaceFactory (this);

    //authenticate the create resource clients
    authenticate(self.getConfig(), function () {

        var routes = self.getConfig().routes;
        for (var prop in routes) {

            var config = {
                            uri : baseUri,
                            path : basePath,
                            routes : routes[prop]
                         };

            var resourceClient = new ResourceClient(config, request);

            self.addResourceClient (resourceClient);
            namespaceFactory.create(prop, resourceClient);
        }

        //Release control, RestClient is ready.
        callback();
    });
};

module.exports = RestClient;
