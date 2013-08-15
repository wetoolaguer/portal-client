var Config = {
                      baseURI : "http://www.github.com",
                     authPath : "auth/user",
                  credentials : {   email : "weto@site.com",
                                 password : "password" },
                       routes : {
                                    "git" : { get: "/" },
                                   "user" : {
                                              get  : "/get/path",
                                              post : "/post/path",
                                              put  : "/put/path",
                                              del  : "/delete/path"
                                            }
                                }
};

module.exports = Config;
