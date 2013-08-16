//Constructor
var ResourceClient = function (routes, restClient) {

    //generate http methods
    for (var prop in routes) {

        if (routes[prop].method === 'get') {
            this[prop] = generateGetMethod(this, restClient, routes[prop].path);
        } else if (routes[prop].method === 'post') {
            this[prop] = generatePostMethod(this, restClient, routes[prop].path);
        } else if (routes[prop].method === 'put') {
            this[prop] = generatePutMethod(this, restClient, routes[prop].path);
        } else if (routes[prop].method === 'del') {
            this[prop] = generateDelMethod(this, restClient, routes[prop].path);
        } else {
            throw new Error ("Unknown HTTP method for function " + prop +
                            ", please check your routes declaration.");
        }

    }
};

var generateGetMethod = function (self, restClient, path) {
    var method = function (reqObj, queryObj, callback) {

        if (arguments.length === 0) {
            throw new Error ("Invalid parameter count: callback parameter required.");
        } else if (arguments.length === 1) {
            callback = reqObj;
            queryObj = {};
            reqObj = {};
        } else if (arguments.length === 2) {
            callback = queryObj;
            queryObj = {};
        }

        //convert quryObj to query string
        var queryString = createQueryString(queryObj);

        var uri = restClient.constructURI(reqObj, restClient.baseURI +
                                          path + queryString);

        restClient.get (uri, callback);
    };

    var createQueryString = function (queryObj) {
        var queryString = "?";

        for (var prop in queryObj) {
            queryString = queryString + prop + "=" + queryObj[prop] + "&";
        }

        //trim last character
        queryString = queryString.substring(0, queryString.length - 1);

        return queryString;
    };

    return method;
};

var generatePostMethod = function (self, restClient, path) {
    var method = function (formObj, reqObj, callback) {

        if (arguments.length <  2) {
            throw new Error ("Invalid parameter count: formObj and callback required.");
        } else if (arguments.length === 2) {
            callback = reqObj;
        }

        var uri = restClient.constructURI(reqObj, restClient.baseURI + path);
        restClient.post (uri, formObj, callback);
    };

    return method;
};

var generatePutMethod = function (self, restClient, path) {
    var method = function (formObj, reqObj, callback) {

        if (arguments.length <  2) {
            throw new Error ("Invalid parameter count: formObj and callback required.");
        } else if (arguments.length === 2) {
            callback = reqObj;
        }

        var uri = restClient.constructURI(reqObj, restClient.baseURI + path);
        restClient.put (uri, formObj, callback);
    };

    return method;
};

var generateDelMethod = function (self, restClient, path) {
    var method = function (reqObj, callback) {

        if (arguments.length === 0) {
            throw new Error ("Invalid parameter count: callback parameter required.");
        } else if (arguments.length === 1) {
            callback = reqObj;
            reqObj = {};
        }

        var uri = restClient.constructURI(reqObj, restClient.baseURI + path);
        restClient.del (uri, callback);
    };

    return method;
};

module.exports = ResourceClient;
