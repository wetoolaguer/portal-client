var RestClient = require ("../lib/rest_client");
var assert = require ("assert");
var async = require ("async");
var fs = require("fs");

describe("RestClient", function () {

    var config = {
                     baseURI   : "http://www.site.com",
                   authPath    : "/auth/user",
                   credentials : {   email : "weto@site.com",
                                  password : "password" },
                        routes : {
                                      users : {
                                                   findBy : { path: "/users/:id", method: 'get' },
                                                   create : { path: "/users", method: 'post' },
                                                   update : { path: "/users/:id", method: 'put' },
                                                 deleteBy : { path: "/users/:id", method: 'del' }
                                              }
                                }
    };

    var restClient = new RestClient(config);

    before(function (done) {
        restClient.init (false, function() {
            done();
        });
    });

    it ("should be able to authenticate", function(done) {
        restClient.authenticate(config.credentials, function(err, resp, body) {
            assert.equal (resp.statusCode, 200);
            done();
        });
    });

    it("should generate namespaces", function () {
        assert.equal(typeof restClient.users, 'object');
    });

    describe ("#get", function () {
        it ("should issue http get request", function (done) {
            restClient.get("http://www.site.com/users/1", function (err, resp, body) {
                assert.equal (resp.statusCode, 200);
                done();
            });
        });
    });

    describe ("#post", function () {
        it ("should issue http post request", function (done) {
            restClient.post("http://www.site.com/users", { name: 'Weto' },
            function (err, resp, body) {
                assert.equal (resp.statusCode, 201);
                done();
            });
        });

        it ("should issue multipart http post request", function (done) {
            var fileloc = './test/files/sample.txt';
            var file = fs.createReadStream(fileloc);

            restClient.post("http://www.site.com/users", { user: file },
            function (err, resp, body) {
                assert.equal (resp.statusCode, 201);
                done();
            });
        });
    });

    describe ("#put", function () {
        it ("should issue http put request", function (done) {
            restClient.put("http://www.site.com/users/1", { name: 'Wenceslao' },
            function (err, resp, body) {
                assert.equal (resp.statusCode, 200);
                done();
            });
        });

        it ("should issue multipart http put request", function (done) {
            var fileloc = './test/files/sample.txt';
            var file = fs.createReadStream(fileloc);

            restClient.put("http://www.site.com/users/1", { user: file },
            function (err, resp, body) {
                assert.equal (resp.statusCode, 200);
                done();
            });
        });
    });

    describe ("#del", function () {
        it ("should issue http del request", function (done) {
            restClient.del("http://www.site.com/users/1",
            function (err, resp, body) {
                assert.equal (resp.statusCode, 200);
                done();
            });
        });
    });

    describe ("#constructURI", function () {
        it("should be able to generate URI based on passed params", function () {
            var uri = "www.site.com/users/:id/:name";
            var reqObj = { id:1, name:"weto" };
            uri = restClient.constructURI(reqObj, uri);

            assert.equal (uri, "www.site.com/users/1/weto");
        });

        it("should delete unsupplied URI params and normalize path", function () {
            var uri = "www.site.com/users/:id/:name";
            var reqObj = { name:"weto" };
            uri = restClient.constructURI(reqObj, uri);

            assert.equal (uri, "www.site.com/users/weto");
        });
    });

    describe("Generated Namespace", function() {
        it("should have findBy method", function () {
            assert.equal(typeof restClient.users.findBy, 'function');
        });

        it("should have create method", function () {
            assert.equal(typeof restClient.users.create, 'function');
        });

        it("should have update method", function () {
            assert.equal(typeof restClient.users.update, 'function');
        });

        it("should have delete method", function () {
            assert.equal(typeof restClient.users.deleteBy, 'function');
        });
    });

});
