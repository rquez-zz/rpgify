var User = require('../models/schema');
var config = require('../config/rpgify');

var Boom = require('boom');

module.exports = {
    createUser: (req, reply) => {

        var newUser = new User({
            email: req.payload.email,
            name: req.payload.name,
            password: User.hashPassword(req.payload.password)
        });

        User.findOne({'email': newUser.email}, (err, existingUser) => {

            // Existing user found
            if (existingUser) {
                return reply(Boom.conflict('Email for this user already exists', err));
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

        User.update({ _id: req.auth.credentials._id }, patch, (err, res) => {
            if (err)
                return reply(Boom.badImplementation('Error updating user', err));

            return reply().code(204);
        });
    },
    getUser: (req, reply) => {

        User.findOne({ _id: req.auth.credentials._id }, config.getable.user, (err, user) => {
            if (err)
                return reply(Boom.badImplementation('Error getting user from db', err));
            if (!user)
                return reply(Boom.notFound('User not found'));

            return reply(user);
        });
    },
    deleteUser: (req, reply) => {

        User.findOneAndRemove({ _id: req.auth.credentials._id }, (err) => {
            if (err)
                return reply(Boom.notFound('User not found'));

            return reply().code(204);
        });
    }
};
