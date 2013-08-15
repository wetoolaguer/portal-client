//Constructor
var ResourceClient = function (routes, restClient) {

    this.routes = routes;

    this.getRestClient = function () {
        return restClient;
    };
};

ResourceClient.prototype.findBy = function (reqObj, callback) {

    if (arguments.length === 0) {
        throw new Error ("Invalid parameter count: callback parameter required.");
    } else if (arguments.length === 1) {
        callback = reqObj;
        reqObj = {};
    }

    var restClient = this.getRestClient();

    var uri = restClient.constructURI(reqObj, restClient.baseURI +
                                       this.routes.get);
    restClient.get (uri, callback);
};

ResourceClient.prototype.create = function (formObj, reqObj, callback) {

    if (arguments.length <  2) {
        throw new Error ("Invalid parameter count: formObj and callback required.");
    } else if (arguments.length === 2) {
        callback = reqObj;
    }

    var restClient = this.getRestClient();

    var uri = restClient.constructURI(reqObj, restClient.baseURI +
                                       this.routes.post);
    restClient.post (uri, formObj, callback);
};

ResourceClient.prototype.update = function (formObj, reqObj, callback) {

    if (arguments.length <  2) {
        throw new Error ("Invalid parameter count: formObj and callback required.");
    } else if (arguments.length === 2) {
        callback = reqObj;
    }

    var restClient = this.getRestClient();

    var uri = restClient.constructURI(reqObj, restClient.baseURI +
                                       this.routes.put);
    restClient.put (uri, formObj, callback);
};

ResourceClient.prototype.deleteBy = function (reqObj, callback) {

    if (arguments.length === 0) {
        throw new Error ("Invalid parameter count: callback parameter required.");
    } else if (arguments.length === 1) {
        callback = reqObj;
        reqObj = {};
    }

    var restClient = this.getRestClient();

    var uri = restClient.constructURI(reqObj, restClient.baseURI +
                                       this.routes.del);
    restClient.del (uri, callback);
};

module.exports = ResourceClient;
