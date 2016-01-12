import jwt from '../helpers/jwt.js';

export default {
    login: (req, reply) => {

        var token = {
            username: req.payload.username
        };

        reply(jwt.sign(token));
    }
};
