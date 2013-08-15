//Constructor
var ResourceClient = function (routes, restClient) {

    this.routes = routes;
    generateHTTPMethods(this,routes);

    this.getRestClient = function () {
        return restClient;
    };

};

var generateHTTPMethods = function (self, routes) {
    for (var prop in routes) {
        if (routes[prop].method === 'get') {
            self[prop] = generateGetMethod(self, routes[prop].path);
        } else if (routes[prop].method === 'post') {
            self[prop] = generatePostMethod(self, routes[prop].path);
        } else if (routes[prop].method === 'put') {
            self[prop] = generatePutMethod(self, routes[prop].path);
        } else if (routes[prop].method === 'del') {
            self[prop] = generateDelMethod(self, routes[prop].path);
        } else {
            throw new Error ("Unknown HTTP method for function " + prop +
                            ", please check your routes declaration.");
        }
    }
};

var generateGetMethod = function (self, path) {
    var method = function (reqObj, callback) {

        if (arguments.length === 0) {
            throw new Error ("Invalid parameter count: callback parameter required.");
        } else if (arguments.length === 1) {
            callback = reqObj;
            reqObj = {};
        }

        var restClient = self.getRestClient();

        var uri = restClient.constructURI(reqObj, restClient.baseURI + path);

        restClient.get (uri, callback);
    };

    return method;
};


var generatePostMethod = function (self, path) {
    var method = function (formObj, reqObj, callback) {

        if (arguments.length <  2) {
            throw new Error ("Invalid parameter count: formObj and callback required.");
        } else if (arguments.length === 2) {
            callback = reqObj;
        }

        var restClient = this.getRestClient();

        var uri = restClient.constructURI(reqObj, restClient.baseURI + path);
        restClient.post (uri, formObj, callback);
    };

    return method;
};

var generatePutMethod = function (self, path) {
    var method = function (formObj, reqObj, callback) {

        if (arguments.length <  2) {
            throw new Error ("Invalid parameter count: formObj and callback required.");
        } else if (arguments.length === 2) {
            callback = reqObj;
        }

        var restClient = this.getRestClient();

        var uri = restClient.constructURI(reqObj, restClient.baseURI + path);
        restClient.put (uri, formObj, callback);
    };

    return method;
};

var generateDelMethod = function (self, path) {
    var method = function (reqObj, callback) {

        if (arguments.length === 0) {
            throw new Error ("Invalid parameter count: callback parameter required.");
        } else if (arguments.length === 1) {
            callback = reqObj;
            reqObj = {};
        }

        var restClient = this.getRestClient();

        var uri = restClient.constructURI(reqObj, restClient.baseURI + path);
        restClient.del (uri, callback);
    };

    return method;
};

module.exports = ResourceClient;
