import User from '../models/schema';
import config from '../config/rpgify';
import Boom from 'boom';

export default {
    createUser: (req, reply) => {

        var newUser = new User({
            username: req.payload.username,
            email: req.payload.email,
            name: req.payload.name,
            password: User.hashPassword(req.payload.password)
        });

        User.findOne({ $or: [{'username': newUser.username}, {'email': newUser.email}] }, (err, existingUser) => {

            // Existing user found
            if (existingUser) {
                if (newUser.username === existingUser.username) { // Username exists
                    return reply(Boom.conflict('Username already exists', err));
                } else { // Email Exists
                    return reply(Boom.conflict('Email already exists', err));
                }
            }

            // Save user into db
            newUser.save(err => {
                if (err)
                    return reply(Boom.badImplementation('Error saving user to db', err));

                return reply().code(204);
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
