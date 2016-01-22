import jwt from 'jsonwebtoken';
import fs from 'fs';
import config from '../config/rpgify';

var key = fs.readFileSync(config.key.path);

export default {
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
