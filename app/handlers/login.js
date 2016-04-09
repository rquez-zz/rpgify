import jwt from '../helpers/jwt';
import User from '../models/schema';

import Boom from 'boom';

export default {
    login: (req, reply) => {

        User.findOne({ email: req.payload.email }, (err, user) => {
            if (err)
                reply(Boom.badImplementation('Error finding user', err));

            if (!user)
                return reply(Boom.notFound('User not found'));

            var token = {
                email: req.payload.email,
                _id: user._id
            };

            if (user.isValidPassword(req.payload.password)) {
                user.update( { lastLogin: Date.now() }, (err, res) => {
                    if (err)
                        return reply(Boom.badImplementation('Error updating user from db', err));
                    return reply(jwt.sign(token));
                });
            } else
                return reply(Boom.unauthorized('Invalid password'));
        });
    }
};
