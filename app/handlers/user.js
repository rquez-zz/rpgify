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

                return reply().code(201);
            });
        });

    },
    updateUser: (req, reply) => {

        var patch = req.payload;

        for (var param in patch) {
            if (config.patchable.user.indexOf(param) === -1)
                return reply(Boom.badData('Patch object contains one of more invalid fields'));
            if (param === 'password') {
                patch.password = User.hashPassword(patch.password);
            }
        }

        User.update({ userid: req.auth.credentials.userid }, patch, (err, res) => {
            if (err)
                return reply(Boom.badImplementation('Error updating user', err));
            if (!user)
                return reply(Boom.notFound('User not found'));

            return reply().code(204);
        });
    },
    getUser: () => {},
    deleteUser: (req, reply) => {

        User.remove({ 'username': req.auth.credentials.username }, (err) => {
            if (err)
                return reply(Boom.badImplementation('Error deleting user from db', err));
            if (!user)
                return reply(Boom.notFound('User not found'));

            return reply().code(204);
        });
    }
};
