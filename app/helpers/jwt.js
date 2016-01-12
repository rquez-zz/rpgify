import jwt from 'jsonwebtoken';
import fs from 'fs';
import config from '../config/rpgify';

var key = fs.readFileSync(config.keyfile);

export default {
    validateToken: (decoded, callback) => {
        if (!decoded) {
            logger.error('Invalid JWT');
            return callback(null, false);
        }
        return callback(null, true, decoded);
    },
    sign: (token) => {
        return jwt.sign(token, key, config.jwtOpts);
    }
};
