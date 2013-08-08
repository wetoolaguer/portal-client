var RestClient = require ("../bin/rest_client");
var config = require ("./config");
var assert = require ("assert");
var async = require ("async");
var fs = require("fs");

describe("ResourceClient", function () {

    var routes = { "admin" : "/admin",
                   "files" : "/files",
                 };

    var restClient = new RestClient(config, routes);

    before (function (done) {
        restClient.init(function(){
            done();
        });
    });

    describe("#post()", function () {
        it ("should issue http POST request", function (done) {
            restClient.admin.post({name: "Weto Olaguer"}, function(err, resp, body) {
                assert(resp.statusCode, 201);
                done();
            });
        });

        it ("should issue multipart http POST request", function (done) {
            var fileLoc = './test/files/sample.txt';
            var file = fs.createReadStream(fileLoc);

            restClient.files.post ({ file: file }, function (err, resp, body) {
                assert(resp.statusCode, 201);
                done();
            });
        });
    });

    describe("#get()", function () {
        it ("should issue http GET request", function (done) {
            restClient.admin.get("Weto Olaguer", function(err, resp, body) {
                assert(resp.statusCode, 200);
                done();
            });
        });
    });

    describe("#put()", function () {

        it ("should issue http PUT request", function (done) {

            var id = "1";

            restClient.admin.put(id, {name: "Towe Olaguer", 'permissions[]' : ""},
                                  function(err, resp, body) {
                assert(resp.statusCode, 200);
                done();
            });
        });

        it ("should issue multipart http PUT request", function (done) {
            var fileLoc = './test/files/sample.txt';
            var file = fs.createReadStream(fileLoc);

            var id = "1";

            restClient.files.put (id, { file: file }, function (err, resp, body) {
                assert(resp.statusCode, 200);
                done();
            });
        });
    });

    describe("#findBy", function () {
        it ("should issue http GET request with params", function (done) {
            restClient.admin.findBy({ name : "Towe Olaguer"}, function (err, resp, body) {
                assert(resp.statusCode, 200);
                done();
            });
        });
    });

    describe("#del()", function () {
        it ("should issue http DEL request", function (done) {
            restClient.admin.del("1", function(err, resp, body) {
                assert(resp.statusCode, 200);
                done();
            });
        });
    });
});
