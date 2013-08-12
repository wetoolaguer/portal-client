var RestClient = require ("../lib/rest_client");
var assert = require ("assert");
var async = require ("async");

describe("RestClient", function () {

    var config = {
                         uri   : "http://www.site.com",
                    basePath   : "",
                   authPath    : "/auth/user",
                   credentials : {   email : "weto@site.com",
                                  password : "password" },
                        routes : { "users" : "/users" }
    };

    var restClient = new RestClient(config);

    before(function (done) {
        restClient.init (function() {
            done();
        });
    });

    it("should generate namespaces", function () {
        assert.equal(typeof restClient.users, 'object');
    });

    it("should change basePath", function (done) {

        async.waterfall([
            function (callback) {
                restClient.changePath ("/newpath");
                restClient.users.get(function(err, resp, body) {
                    assert.equal(resp.body, "This is a new path for Users page.");
                    callback();
                });
            },
            function (callback) {
                restClient.changePath ("");
                restClient.users.get(function(err, resp, body) {
                    assert.equal(resp.body, "This is Users page.");
                    callback();
                });
            }
        ], function (err) {
            done();
        });
    });

    describe("Generated Namespace", function() {
        it("should have get method", function () {
            assert.equal(typeof restClient.users.get, 'function');
        });

        it("should have post method", function () {
            assert.equal(typeof restClient.users.post, 'function');
        });

        it("should have put method", function () {
            assert.equal(typeof restClient.users.put, 'function');
        });

        it("should have del method", function () {
            assert.equal(typeof restClient.users.del, 'function');
        });

        it("should have findBy method", function () {
            assert.equal(typeof restClient.users.findBy, 'function');
        });
    });
});
