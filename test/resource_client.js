var RestClient = require ("../lib/rest_client");
var assert = require ("assert");
var async = require ("async");
var fs = require("fs");

describe("ResourceClient", function () {

    var config = {
                       baseURI :"http://www.site.com",
                      authPath : "/auth/user",
                   credentials : {   email : "weto@site.com",
                                  password : "password" },
                        routes : {
                                    "users" : {
                                                 get  : "/users/:id",
                                                 post : "/users",
                                                 put  : "/users/:id",
                                                 del  : "/users/:id"
                                              }
                                 }
    };

    var restClient = new RestClient(config);

    before (function (done) {
        restClient.init(function(){
            done();
        });
    });

    describe("#create", function () {
        it ("should issue http POST request", function (done) {
            restClient.users.create({name: "Weto"}, function(err, resp, body) {
                assert(resp.statusCode, 201);
                done();
            });
        });

        it ("should issue multipart http POST request", function (done) {
            var fileloc = './test/files/sample.txt';
            var file = fs.createReadStream(fileloc);

            restClient.users.create({ user: file }, function (err, resp, body) {
                assert(resp.statusCode, 201);
                done();
            });
        });
    });

    describe("#findBy", function () {
        it ("should issue http GET request", function (done) {
            restClient.users.findBy({ id : 1 }, function(err, resp, body) {
                assert(resp.statusCode, 200);
                done();
            });
        });
    });

    describe("#update", function () {

        it ("should issue http PUT request", function (done) {

            var id = "1";

            restClient.users.update({ name: "Wenceslao" }, { id: 1 },
                                  function(err, resp, body) {
                assert(resp.statusCode, 200);
                done();
            });
        });

        it ("should issue multipart http PUT request", function (done) {
            var fileLoc = './test/files/sample.txt';
            var file = fs.createReadStream(fileLoc);

            var id = "1";

            restClient.users.update ({ name: file }, { id: 1 },
                                     function (err, resp, body) {
                assert(resp.statusCode, 200);
                done();
            });
        });
    });

    describe("#deleteBy", function () {
        it ("should issue http DEL request", function (done) {
            restClient.users.deleteBy({ id : 1 }, function(err, resp, body) {
                assert(resp.statusCode, 200);
                done();
            });
        });
    });
});
