var NamespaceFactory = require('./namespace_factory');
var ResourceClient = require('./resource_client');
var request = require ('request');

var RestClient = function (config, routes) {

    this.getConfig = function () {
        return config;
    };

    this.getRoutes = function () {
        return routes;
    };

};

var authenticate = function (authOptions, callback) {
    request.post(authOptions.uri + authOptions.auth_path, {

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

    var config = this.getConfig();
    config.basePath = path;
};

RestClient.prototype.init = function (callback) {

    var self = this;

    var baseUri = this.getConfig().uri + this.getConfig().basePath;
    var namespaceFactory  = new NamespaceFactory (this);

    //authenticate the create resource clients
    authenticate(self.getConfig(), function () {

        var routes = self.getRoutes();

        for (var prop in routes) {
            var resourceClient = new ResourceClient(baseUri, routes[prop], request);
            namespaceFactory.create(prop, resourceClient);
        }

        //Release control, RestClient is ready.
        callback();
    });
};

module.exports = RestClient;
