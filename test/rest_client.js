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

    describe("Generated Namespace", function() {
        it("should have findBy method", function () {
            assert.equal(typeof restClient.users.findBy, 'function');
        });

        it("should have create method", function () {
            assert.equal(typeof restClient.users.createBy, 'function');
        });

        it("should have update method", function () {
            assert.equal(typeof restClient.users.updateBy, 'function');
        });

        it("should have delete method", function () {
            assert.equal(typeof restClient.users.deleteBy, 'function');
        });
    });
});
