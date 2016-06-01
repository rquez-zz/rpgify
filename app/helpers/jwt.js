var config = require('../config/rpgify');

var jwt = require('jsonwebtoken');
var fs = require('fs');

const key = fs.readFileSync('privateKey');

var jwtHelper = {
    validateToken: (request, decoded, callback) => {

        if (!decoded) {
            return callback(null, false, decoded);
        }
        return callback(null, true, decoded);
    },
    sign: (token) => {
        return jwt.sign(token, key, config.jwt);
    }
};

module.exports = jwtHelper;
