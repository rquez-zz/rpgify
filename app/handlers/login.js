import jwt from '../helpers/jwt.js';
import User from '../models/schema.js';
import boom from 'boom';
import bcrypt from 'bcrypt';

export default {
    login: (req, reply) => {

        User.findOne({ username: req.payload.username }, (err, user) => {
            if (err) throw err;

            var token = {
                username: req.payload.username,
                userid: user._id
            };

            bcrypt.compare(req.payload.password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    reply(jwt.sign(token));
                } else {
                    reply(boom.unauthorized('Invalid password'));
                }
            });
        });
    }
};
