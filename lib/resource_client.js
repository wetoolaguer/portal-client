var FormData = require ('form-data');

//methods list
var GET = 'get';
var POST = 'post';
var PUT = 'put';
var DEL = 'del';

//Constructor
var ResourceClient = function (config, requestClient) {

    //handles string uris value
    if (typeof config.routes === 'string') {
        config.routes = { uri : config.routes };
    }

    this.request = requestClient;
    this.baseURI = config.uri;
    this.basePath = config.path;
    this.URIs = config.routes;

    if (!this.URIs.uri) {
        throw new Error ("Invalid URI object. Pass an object with a uri" +
                         "property and optional 'get', 'post', 'put' and " +
                         "'del' properties.");
    }
};

ResourceClient.prototype.get = function (item, callback) {
    if (typeof item === 'function') {
        callback = item;
        item = null;
    }

    var uri = this.baseURI + this.basePath + getResourceURI(GET, this.URIs);

    if (item !== null) {
        this.request(uri + "/" + item, function (err, resp, body) {
            callback(err, resp, body);
        });
    } else {
        this.request(uri, function (err, resp, body) {
            callback(err, resp, body);
        });
    }

};

var isMultipart = function (formObj) {

    var multipart = false;

    //determine if the form is multipart
    for (var prop in formObj) {
        //having an object in the form suggests a multipart form
        if (typeof formObj[prop] === 'object') {
            multipart = true;
            break;
        }
    }

    return multipart;

};

ResourceClient.prototype.post = function (formObj, callback) {
    var self = this;
    var uri = this.baseURI + this.basePath + getResourceURI(POST, this.URIs);
    var multipart = isMultipart(formObj);

    if (multipart) {

        //use form-data for a multipart upload
        //request's form data cannot be used because of
        //content-length missing issue in nginx

        var form = new FormData();

        for (var prop in formObj) {
            form.append (prop, formObj[prop]);
        }

        //get the content length before issuing a post request
        form.getLength(function (err, length) {
            var postObj = { url: uri,
                       headers : { 'content-length': length }
            };

            self.request.post(postObj, function (err, resp, body) {
                callback(err, resp, body);
            })._form = form; //override the form object in request
        });

    } else {
        this.request.post(uri, { form : formObj }, function (err, resp, body) {
            callback(err, resp, body);
        });
    }
};


ResourceClient.prototype.put = function (item, formObj, callback) {
    var self = this;
    var uri = this.baseURI + this.basePath + getResourceURI(PUT, this.URIs) + "/" + item;
    var multipart = isMultipart(formObj);

    if (multipart) {

        //use form-data for a multipart upload
        //request's form data cannot be used because of
        //content-length missing issue in nginx

        var form = new FormData();

        for (var prop in formObj) {
            form.append (prop, formObj[prop]);
        }

        //get the content length before issuing a post request
        form.getLength(function (err, length) {
            var putObj = { url: uri,
                       headers : { 'content-length': length }
            };

            self.request.put(putObj, function (err, resp, body) {
                callback(err, resp, body);
            })._form = form; //override the form object in request
        });

    } else {
        this.request.put(uri, { form : formObj }, function (err, resp, body) {
            callback(err, resp, body);
        });
    }
};

ResourceClient.prototype.del = function (item, callback) {

    if (typeof item === 'function') {
        callback = item;
        item = null;
    }

    var uri = this.baseURI + this.basePath + getResourceURI(DEL, this.URIs);

    if (item !== null) {
        this.request.del(uri + "/" + item, function (err, resp, body) {
            callback(err, resp, body);
        });
    } else {
        this.request.del(uri, function (err, resp, body) {
            callback(err, resp, body);
        });
    }
};


ResourceClient.prototype.findBy = function (params, callback) {
    var paramString = "?";

    if (typeof params === "object") {
        for (var prop in params) {
            paramString = paramString + prop + "=" + params[prop] + "&";
        }
    } else {
        paramString = params;
    }

    //trim the last & symbol in the params
    if (paramString[paramString.length - 1] === "&") {
        paramString = paramString.slice(0, -1);
    }

    var uri = this.baseURI + this.basePath + getResourceURI(GET, this.URIs) + paramString;

    this.request(uri, function (err, resp, body) {
        callback(err, resp, body);
    });
};

//determines the URI to use
var getResourceURI = function (method, URIs) {

    var uri;

    if (method === GET) {
        uri = URIs.get ? URIs.get : URIs.uri;
    } else if (method === POST) {
        uri = URIs.post ? URIs.post : URIs.uri;
    } else if (method === PUT) {
        uri = URIs.put ? URIs.put : URIs.uri;
    } else if (method === DEL) {
        uri = URIs.del ? URIs.del : URIs.uri;
    }

    return uri;
};

module.exports = ResourceClient;
