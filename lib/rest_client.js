var ResourceClient = require("./resource_client");
var request = require ("request");
var FormData = require("form-data");
var path = require("path");

var RestClient = function (conf) {
    var config = conf;
    this.request = request;
    this.baseURI = config.baseURI;
    this.getConfig = function () {
        return config;
    };
};

RestClient.prototype.authenticate = function (authOptions, callback) {
    var self = this;
    self.request.post(authOptions.baseURI + authOptions.authPath, {

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
                cookie = self.request.cookie(cookie);

                //create a new request cookie jar to store the cookie
                //the new cookie jar will be passed as a default cookie
                //jar for all of our requests
                var cookieJar = self.request.jar();
                cookieJar.add(cookie);

                //override our request object with the new options
                self.request = self.request.defaults ({
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

//HTTP methods
RestClient.prototype.get = function (uri, callback) {
    this.request.get(uri, function (err, resp, body) {
        callback(err, resp, body);
    });

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

RestClient.prototype.post = function (uri, formObj, callback) {
    var self = this;
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
        self.request.post(uri, { form : formObj }, function (err, resp, body) {
            callback(err, resp, body);
        });
    }
};


RestClient.prototype.put = function (uri, formObj, callback) {
    var self = this;
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
        self.request.put(uri, { form : formObj }, function (err, resp, body) {
            callback(err, resp, body);
        });
    }
};

RestClient.prototype.del = function (uri, callback) {

    this.request.del(uri, function (err, resp, body) {
        callback(err, resp, body);
    });

};

RestClient.prototype.constructURI = function (reqObj, uri) {

    for (var prop in reqObj) {
        uri = uri.replace(":" + prop, reqObj[prop]);
    }

    console.log('replaced uri:');
    console.log(uri);

    //remove unreplaced :value
    uri = uri.replace(/:(\w+)/g, "");
    console.log('cleaned uri');
    console.log(uri);

    //normalize path
    uri = path.normalize(uri);
    console.log('normalized uri');
    console.log(uri);
    return uri;
};

RestClient.prototype.init = function (callback) {

    var self = this;

    //authenticate the create resource clients
    self.authenticate(self.getConfig(), function () {

        var routes = self.getConfig().routes;
        for (var prop in routes) {

            var resourceRoutes = routes[prop];
            var resourceClient = new ResourceClient(resourceRoutes, self);

            //create a namespace for the resourceClient
            self[prop] = resourceClient;
        }

        //Release control, RestClient is ready.
        callback();
    });
};

module.exports = RestClient;
