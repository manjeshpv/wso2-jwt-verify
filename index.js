/**
 *  Module dependencies.
 *  Manjesh Vinayaka<manjeshpv@gmail.com>
 */

var crypto = require('crypto');


/**
 * Helpers method
 *
 * @param {String} name
 * @return {Function}
 * @api public
 */

function wso2_jwt_verify (public_key,token_header_name,error_json) {
    return function (req, res, next) {

        var publicKey = public_key;
        var token = req.headers[token_header_name]
        console.log(token)
//------------------------ jwt.verify
       try {
           var parts = token.split('.')
           var header = parts[0]
           var body = parts[1]
           var sign = parts[2]

           header = new Buffer(header, 'base64').toString()
           body = new Buffer(body, 'base64').toString()
           //console.log("body",body)
           var encodedHeaderPlusBody = parts.splice(0,2).join('.')
           var verifier = crypto.createVerify('sha256');
           verifier.update(encodedHeaderPlusBody);
           var ver = verifier.verify(publicKey, sign,'base64');
           console.log("JWT Verification Status: ", ver);//<--- always false!
           var decodedBody = new Buffer("body", 'base64').toString('ascii')
           console.log(decodedBody)
           if (ver) {
               next()
           } else {
               if(!error_json)
                   error_json = {code:500,message:"internal server error",description:'error_json Arguement not defined. JWT Signature Verfication Failed'}
               res.json(error_json)
           }
       } catch(e){
           res.json({code:500,message:"internal server error",description:e})
       }


    }
}

module.exports = wso2_jwt_verify