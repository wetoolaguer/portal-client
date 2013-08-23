# PORTAL CLIENT

This is an HTTP client with predefined uri and routes.

Predefined routes are accessed with corresponding namespaces.

## Installation
```
npm install git+https://github.com/wetoolaguer/portal-client.git
```
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

### Routes
The routes object is the declaration of the namespaces to be generated
and the http methods associated with them.
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

                      findBy  : { path: "/admins/:id", method: "get" },
                       create : { path: "/admins", method: "post" },
                      update  : { path: "/admins/:id", method: "put" },
                    deleteBy  : { path: "/admins/:id", method: "del" }

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
By default, portal client authenticates with the given configuration
object. If authentication is not desired, you may pass a false parameter
in the constructor before the config object.
 
### Authentication
If authentication is disabled, you may still authenticate later with the
authenticate function.
```javascript
  var credentials = {   email : "admin@site.com",
                        password : "password" }

  portalClient.authenticate (credentials, function (err, resp, body) {
      //portal client is authenticated after this, if config and credentials 
      //are right.
  }); 
```
### HTTP Methods
After the initialization, we can do the following:
```javascript

  //this will issue a post request to http://www.site.com/users
  //with the form data, name: User Name
  portalClient.users.create({ name: "User Name" }, function (err, resp, body) {
      //do whatever you want with the response
  });

  //this will issue a get request to http://www.site.com/users/1
  portalClient.users.findBy({ id: 1 }, function (err, resp, body) {
      //do whatever you want with the response
  });

  //this will issue a put request to http://www.site.com/users/1
  //with the form data, name:Updated UserName
  portalClient.users.update({ name: Updated UserName }, { id: 1 }, 
  function (err, resp, body) {
      //do whatever you want with the response
  });

  //this will issue a del request to http://www.site.com/users/1
  portalClient.users.deleteBy({ id: 1 }, function (err, resp, body) {
      //do whatever you want with the response
  });
 
  //this will issue a post request to http://www.site.com/admins
  //with the form data, name: Admin Name
  portalClient.admins.create({ name: "Admin Name" }, function (err, resp, body) {
      //do whatever you want with the response
  });
```

#### The requestObject
The requestObject is an object passed to the generated http functions.
```javascript
  //this requestObject will replace the values in the route:
  // /groups/:groupId/users/:id
  var reqObject = { groupId:1, id:1 };

  //this will issue a get request to http://www.site.com/groups/1/users/1
  portalClient.users.findInGroup (reqObject, 
  function (err, resp, body) {
    //do whatever you want with the response
  });

```
#### The callback function

After every http method call, a callback function is executed receiving
3 parameters:
+ err: An error object which can be thrown if present.
+ resp: An http response object with data such as resp.body,
resp.headers, resp.statusCode and etc.
+ body: A sugarcoat for resp.body

Portal client is written on top of mikeal's [request]:https://github.com/mikeal/request
package. You can view its documentation for more information on the
returned objects.

#### Generated Get Methods
#####  functionName ( reqObj, queryString, callback )
```javascript
  //this will issue a get request to http://www.site.com/admins?age=10
  portalClient.admins.findBy({}, { age: 10 }, function (err, resp, body) {
      //do whatever you want with the response
  });
```
Parameters:
+ reqObj (required if parameter is desired): An object of which
 key-value pairs replace the corresponding parameters in the declared
routes.
+ paramter (optional):An object of which key-value pairs are converted as
 query string.
+ callback: The callback function to be executed when the request
 receives a response.

#### Generated Post Methods
#####  functionName ( formObj, reqObj, callback )
```javascript
  //this will issue a post request to http://www.site.com/admins
  //with the form data, name: Admin Name, password: pass
  portalClient.admins.create({ name: "Admin Name", password: "pass" }, function (err, resp, body) {
      //do whatever you want with the response
  });
```
+ formObj (required): An object of which key-value pairs represent
form data.
+ reqObj (optional): An object of which
 key-value pairs replace the corresponding parameters in the declared
routes.
+ callback: The callback function to be executed when the request
 receives a response.

###### Multipart Post
Passing a formObject with a property of which value is an object will
automatically trigger a multipart post.
```javascript
      var fileLoc = './admin_profile.txt';
      var profile = fs.createReadStream(fileLoc);

      var formObj = { name : Admin Name, file: profile }  

      //this will issue a post request to http://www.site.com/admins
      //with the form data, name: Admin Name, file: admin_profile.txt
      restClient.admins.create (formObj, function (err, resp, body) {
          //do whatever you want with the response
      });
```
#### Generated Put Methods
##### functionName ( formObj, reqObj, callback )
```javascript
  //this will issue a put request to http://www.site.com/admins/1
  //with the form data name:Updated AdminName
  portalClient.admins.update({ name: "Updated AdminName" }, { id: 1 }, 
  function (err, resp, body) {
      //do whatever you want with the response
  });
```
+ formObj (required): An object of which key-value pairs represent
form data.
+ reqObj (optional): An object of which
 key-value pairs replace the corresponding parameters in the declared
routes.
+ callback: The callback function to be executed when the request
 receives a response.

###### Multipart Post
Passing a formObject with a property of which value is an object will
automatically trigger a multipart put.
```javascript
      var fileLoc = './admin_profile.txt';
      var profile = fs.createReadStream(fileLoc);

      var formObj = { file: profile }  

      //this will issue a put request to http://www.site.com/admins/1
      //with the form data, file: admin_profile.txt
      restClient.admins.update (formObj, { id: 1 }, function (err, resp, body) {
          //do whatever you want with the response
      });
```

#### Generated Del Methods
##### functionName ( reqObj, callback )
```javascript
  //this will issue a del request to http://www.site.com/admins/1
  portalClient.admins.deleteBy({ id: 1 }, function (err, resp, body) {
      //do whatever you want with the response
  });
```
+ reqObj (optional): An object of which
 key-value pairs replace the corresponding parameters in the declared
routes.
+ callback: The callback function to be executed when the request
 receives a response.
