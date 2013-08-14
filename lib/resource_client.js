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
    console.log(uri);
    restClient.get (uri, callback);
};

ResourceClient.prototype.createBy = function (reqObj, formObj, callback) {

    if (arguments.length <  2) {
        throw new Error ("Invalid parameter count: formObj and callback required.");
    } else if (arguments.length === 2) {
        callback = formObj;
        formObj = reqObj;
    }

    var restClient = this.getRestClient();

    var uri = restClient.constructURI(reqObj, restClient.baseURI +
                                       this.routes.post);
    restClient.post (uri, formObj, callback);
};

ResourceClient.prototype.updateBy = function (reqObj, formObj, callback) {

    if (arguments.length <  2) {
        throw new Error ("Invalid parameter count: formObj and callback required.");
    } else if (arguments.length === 2) {
        callback = formObj;
        formObj = reqObj;
    }

    var restClient = this.getRestClient();

    var uri = restClient.constructURI(reqObj, restClient.baseURI +
                                       this.routes.put);
    restClient.put (uri, callback);
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
