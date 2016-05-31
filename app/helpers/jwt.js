var config = require('../config/rpgify');

var jwt = require('jsonwebtoken');
var fs = require('fs');

var key = fs.readFileSync('privateKey');

module.exports = {
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
