var RestClient = require ("../bin/rest_client");
var config = require ("./config");
var assert = require ("assert");

describe("RestClient", function () {

    var routes = { "users" : "/users" };
    var restClient = new RestClient(config, routes);

    before(function (done) {
        restClient.init (function() {
            done();
        });
    });

    it("should generate namespaces", function () {
        assert.equal(typeof restClient.users, 'object');
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
