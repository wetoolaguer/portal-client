var nock = require('nock');

before(function() {
    nock("http://www.site.com")
    .post("/auth/user")
    .times(Number.MAX_VALUE)
    .reply(200)
    .get("/users/1")
    .times(2)
    .reply(200, "User's Page")
    .post("/users")
    .times(4)
    .reply(201, "User Created")
    .put("/users/1")
    .times(4)
    .reply(200, "User Updated")
    .delete("/users/1")
    .times(2)
    .reply(200,"User Deleted");
});
