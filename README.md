# wso2-jwt-verify

### Express Middleware for Verify JWT Signature
Signed with WSO3 SHA256withRSA wso2carbok Private Key

jsonwebtoken jwt.verify() not worked for me.

Enabled JWT in WSO2 Using : https://docs.wso2.com/display/AM190/Passing+Enduser+Attributes+to+the+Backend+Using+JWT
#####<SignatureAlgorithm>SHA256WITHRSA<SignatureAlgorithm/>

Downloaded /repository/resources/security/wso2carbon.jks from WSO2 Installation Server

Opened Using http://sourceforge.net/projects/keystore-explorer/

In list of keys, Right clicked on wso2corbon & Export > Public Key > OpenSSL > Named "public.key"
![WSO2 Implementation](https://docs.google.com/drawings/d/1ahRrSj9XxgxqnPcwVL8Mm_RMtHqAkQdXuZqMabxmZjA/pub?w=960&amp;h=720)

* 1. Sending request to WSO2 API Gateway 
```sh
curl -k -d "grant_type=password&username=<USER>&password=<PASSWORD>" -H "Authorization: Basic ZjA0N1BNMGhkVVdrRE9wVjdxbjdsYjJmOWtvYTo2RGtmdGpib1Z6aVFNUE11Y1VRMUZCTzVrRFlh, Content-Type: application/x-www-form-urlencoded" https://api.wso2server.com:8243/token
```
* 2. Response from OAuth2 Server with JWT Reference Token(not having jwt-assertion) & I think stores original JWT signed using Private key (wso2carbon inside wso2carbon.jks - explore using keystore exploree)
* 3. Requesting Resource with JWT 
```sh
curl -X GET --header "Accept: application/json" --header "Authorization: Bearer 7dd37d727a74215316f4c873ccf6378e" "https://api.wso2server.com:8243/resource/1.0.0/"
```
* 4. API Gateway adds jwt-assertion(JWT By Value Token haveing header.body.signature format) & forwards request resource server.
* 5. Resource Server verifies SHA256withRSA signature using public key taken from keystore explorer. And Sends Resources if JWT Signature is valid.
* 6. API Manager  forwards resource/s to Client

## Installation

```sh
$ npm install wso2-jwt-verify
```

or specify in package.json as dependency

## Usage

with express

```js
// Filesystem to read Public Key file
var fs = require('fs')

// Parse Body
var bodyParser = require('body-parser');

var express = require('express');

// Setup server
var app = express();

var wso2_jwt_verify = require('wso2-jwt-verify');



app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

var publicKey = fs.readFileSync('publicx.key');
var token_header_name = 'x-jwt-assertion'
var error_json = { code:401, message:"invalid token", description:"Invalid Access or Bearer Token "}

app.use(wso2_jwt_verify(publicKey, token_header_name, error_json)) // make sure you declare this middleware after `body-parser`  middleware and before `express.router`.

var server = http.createServer(app);

server.listen('8000', 'localhost', function () {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

```

In your views you would have access to some methods and variables. The middleware also exposes `req` object.

## License
(The MIT License)

Copyright (c) 2014 Manjesh V < [manjeshpv@gmail.com](mailto:manjeshpv@gmail.com) >

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
