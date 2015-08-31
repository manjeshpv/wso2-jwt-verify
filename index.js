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
//------------------------ jwt.verify
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

        if (ver) {
            next()
        } else {
            res.json(error_json)
        }

    }
}

module.exports = wso2_jwt_verify