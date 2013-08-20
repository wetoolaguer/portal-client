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
                                password : "password" }
};
```

The routes object is the declaration of the namespaces to be generated
and the http methods associated to them.
```javascript
config.routes = {
                  users : {

                        findBy  : { path: "/users/:id", method: "get" },
                         create : { path: "/users", method: "post" },
                        update  : { path: "/users/:id", method: "put" },
                      deleteBy  : { path: "/users/:id", method: "del" },
                    
                      findAll : { path: "/users", method: "get" },
                      findInGroup : { path: "/groups/:groupId/users/:id",
                                      method: "get" }
                  },
            
                  admins : {

                      findBy  : { path: "/admin/:id", method: "get" },
                       create : { path: "/admin", method: "post" },
                      update  : { path: "/admin/:id", method: "put" },
                    deleteBy  : { path: "/admin/:id", method: "del" }

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
```javascript

  //this will issue a post request to http://www.site.com/users
  //with the form data name: User Name
  portalClient.users.create({ name: "User Name" }, function (err, resp, body) {
      //do whatever you want with the response
  });

  //this will issue a get request to http://www.site.com/users/1
  portalClient.users.findBy({ id: 1 }, function (err, resp, body) {
      //do whatever you want with the response
  });

  //this will issue a put request to http://www.site.com/users/1
  //with the form data name:Updated UserName
  portalClient.users.update({ name: Updated UserName }, { id: 1 }, 
  function (err, resp, body) {
      //do whatever you want with the response
  });

  //this will issue a del request to http://www.site.com/users/1
  portalClient.users.deleteBy({ id: 1 }, function (err, resp, body) {
      //do whatever you want with the response
  });
 
  //this will issue a post request to http://www.site.com/admins
  //with the form data name: Admin Name
  portalClient.admins.create({ name: "Admin Name" }, function (err, resp, body) {
      //do whatever you want with the response
  });
```

#### The requestObject
The requestObject is an object passed to the generated http functions.
```javascripy
  //this requestObject will replace the values in the route:
  // /groups/:groupId/users/:id
  var reqObject = { groupId:1, id:1 };

  portalClient.users.findInGroup (reqObject, 
  function (err, resp, body) {
    //do whatever you want with the response
  });

```
#### Generated Get Methods
#####  functionName ( reqObj, queryString, callback )
```javascript
  //this will issue a get request to http://www.site.com/users?age=10
  portalClient.users.findBy({}, { age: 12 }, {
  function (err, resp, body) {
      //do whatever you want with the response
  });
```

#### Generated Post Methods
#####  functionName ( formObj, reqObj, callback )

#### Generated Put Methods
##### functionName ( formObj, reqObj, callback )

#### Generated Del Methods
##### functionName ( reqObj, callback )
