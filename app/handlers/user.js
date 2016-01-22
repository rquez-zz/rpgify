import User from '../models/schema';
import config from '../config/rpgify';
import Boom from 'boom';

export default {
    createUser: (req, reply) => {

        // Hash password and insert user
        bcrypt.genSalt(config.bcrypt.workFactor, (err, salt) => {
            if (err) throw err;
            bcrypt.hash(req.payload.password, salt, (err, hash) => {
                if (err) throw err;

                User.create({
                    username: req.payload.username,
                    password: hash,
                    firstname: req.payload.firstname,
                    lastname: req.payload.lastname
                }, (err, user) => {
                    if (err) throw err;
                    return reply().code(204);
                });
            });
        });
    },
    updateUser: () => {},
    getUser: () => {},
    deleteUser: (req, reply) => {

        User.remove({ 'username': req.auth.credentials.username }, (err) => {
            if (err)
                return reply(Boom.badImplementation('Error deleting user from db', err));

            return reply().code(204);
        });
    }
};
