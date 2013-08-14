var ResourceClient = require('./resource_client');
var request = require ('request');

var RestClient = function (conf) {
    var config = conf;

    this.getConfig = function () {
        return config;
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

//HTTP methods
ResourceClient.prototype.get = function (uri, callback) {
    request.get(uri, function (err, resp, body) {
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

ResourceClient.prototype.post = function (uri, formObj, callback) {
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


ResourceClient.prototype.put = function (uri, formObj, callback) {
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

ResourceClient.prototype.del = function (uri, callback) {

    request.get(uri, function (err, resp, body) {
        callback(err, resp, body);
    });

};

RestClient.prototype.constructURI = function (reqObj, uri) {

    for (var prop in obj) {
        uri = uri.replace(":" + prop, obj[prop]);
    }

    return uri;
};

RestClient.prototype.init = function (callback) {

    var self = this;

    var baseUri = this.getConfig().uri;

    //authenticate the create resource clients
    authenticate(self.getConfig(), function () {

        var routes = self.getConfig().routes;
        for (var prop in routes) {

            var resourceRoutes = routes[prop];
            var resourceClient = new ResourceClient(resourceRoutes, this);

            //create a namespace for the resourceClient
            self[prop] = resourceClient;
        }

        //Release control, RestClient is ready.
        callback();
    });
};

module.exports = RestClient;
