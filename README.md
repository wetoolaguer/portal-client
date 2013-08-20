# PORTAL CLIENT

This is a module that generates an HTTP client with predefined uri and
routes.

Predefined routes are accessed with corresponding namespaces.

## Installation

## Usage

### Config
The following shows the configuration object needed to initialize the
client.

```javascript
var config = {
                     baseURI :"http://www.site.com",
                    authPath : "/auth/user",
                 credentials : {   email : "admin@site.com",
                                password : "password" },
};
```

The routes object is the declaration of the namespaces to be generated
and the http methods associated to them.
```
config.routes = {
                  users : {

                      findBy  : { path: "/users/:id", method: 'get' },
                       create : { path: "/users", method: 'post' },
                      update  : { path: "/users/:id", method: 'put' },
                    deleteBy  : { path: "/users/:id", method: 'del' }

                  }
}
```
### Initialization
```javascript
  var portalClient = new PortalClient(config);

  portalClient.init(function(){
      //Portal Client is now usable in this callback function.
  });
```
### HTTP Methods
After the initialization, we can do the following:
```

  //this will issue a post request to http://www.site.com/users
  //with the form data name: User Name
  portalClient.users.create({ name: "User Name" }, function (err, resp, body) {
      //do whatever you want with the response
  });

  //this will issue a get request to http://www.site.com/users/1
  portalClient.users.findBy({ id:1 }, function (err, resp, body) {
      //do whatever you want with the response
  });

  //this will issue a put request to http://www.site.com/users/1
  //with the form data name:Updated UserName
  portalClient.users.findBy({ name: Updated UserName }, { id:1 }, 
  function (err, resp, body) {
      //do whatever you want with the response
  });

  //this will issue a del request to http://www.site.com/users/1
  portalClient.users.deleteBy({ id:1 }, function (err, resp, body) {
      //do whatever you want with the response
  });
```

#### Get

#### Post

#### Put

#### Delete
