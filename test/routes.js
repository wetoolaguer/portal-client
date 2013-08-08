var RestClient = require ("../lib/rest_client");
var config = require ("./config");
var assert = require("assert");

describe("Routes", function () {

    var routes = { "default"  : {
                                    uri : "/uri/default",
                                },
                   "override" : {
                                    uri : "/uri/default",
                                    get : "/uri/get",
                                    post: "/uri/post",
                                    put : "/uri/put",
                                    del : "/uri/del"
                                }
                 };

    var restClient = new RestClient(config, routes);

    before(function (done) {
        restClient.init(function() {
            done();
        });
    });

    describe ("uri value", function () {
        it("should set the default path for get request", function (done) {
            restClient.default.get(function(err, resp) {
                var uri = JSON.parse(resp.body).uri;
                assert.equal(uri, routes.default.uri);
                done();
            });
        });

        it("should set the default path for post request", function (done) {
            restClient.default.post({}, function(err, resp) {
                var uri = JSON.parse(resp.body).uri;
                assert.equal(uri, routes.default.uri);
                done();
            });
        });

        it("should set the default path for put request", function (done) {
            restClient.default.put("sample", {}, function(err, resp) {
                var uri = JSON.parse(resp.body).uri;
                assert.equal(uri, routes.default.uri);
                done();
            });
        });

        it("should set the default path for del request", function (done) {
            restClient.default.del(function(err, resp) {
                var uri = JSON.parse(resp.body).uri;
                assert.equal(uri, routes.default.uri);
                done();
            });
        });
    });

    describe ("get value", function () {
        it("should overwrite the default path for get request", function (done) {
            restClient.override.get(function(err, resp) {
                var uri = JSON.parse(resp.body).uri;
                assert.equal(uri, routes.override.get);
                done();
            });
        });
    });

    describe ("post value", function () {
        it("should overwrite the default path for post request", function (done) {
            restClient.override.post({}, function(err, resp) {
                var uri = JSON.parse(resp.body).uri;
                assert.equal(uri, routes.override.post);
                done();
            });
        });
    });

    describe ("put value", function () {
        it("should overwrite the default path for put request", function (done) {
            restClient.override.put("sample", {}, function(err, resp) {
                var uri = JSON.parse(resp.body).uri;
                assert.equal(uri, routes.override.put);
                done();
            });
        });
    });

    describe ("del value", function (done) {
        it("should overwrite the default path for del request", function (done) {
            restClient.override.del(function(err, resp) {
                var uri = JSON.parse(resp.body).uri;
                assert.equal(uri, routes.override.del);
                done();
            });
        });
    });
});
