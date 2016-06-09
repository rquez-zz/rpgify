const User = require('../models/schema');
const config = require('../config/rpgify');

const Boom = require('boom');

const user = {
    createUser: (req, reply) => {

        var newUser = new User({
            email: req.payload.email,
            name: req.payload.name,
            password: User.hashPassword(req.payload.password)
        });

        User.findOne({'email': newUser.email}, (err, existingUser) => {

            if (existingUser) {
                return reply(Boom.conflict('Email for this user already exists', err));
            }

            newUser.save(err => {

                if (err) {
                    return reply(Boom.badImplementation('Error saving user to db', err));
                }

                var createdUser = {
                    email: newUser.email,
                    name: newUser.name,
                    signup: newUser.signup
                };

                return reply(createdUser).code(201).header('location', '/user');
            });
        });

    },
    updateUser: (req, reply) => {

        var put = req.payload;

        User.update({ _id: req.auth.credentials._id }, put, (err, res) => {

            if (err) {
                return reply(Boom.badImplementation('Error updating user', err));
            }

            return reply().code(204);
        });
    },
    getUser: (req, reply) => {

        User.findOne({ _id: req.auth.credentials._id }, config.getable.user, (err, user) => {

            if (err) {
                return reply(Boom.badImplementation('Error getting user from db', err));
            }

            if (!user) {
                return reply(Boom.notFound('User not found'));
            }

            return reply(user);
        });
    },
    deleteUser: (req, reply) => {

        User.findOneAndRemove({ _id: req.auth.credentials._id }, (err, user) => {

            if (!user) {
                return reply(Boom.notFound('User not found'));
            }
            if (err) {
                return reply(Boom.badImplementation('Error deleting user from db', err));
            }

            return reply().code(204);
        });
    }
};

module.exports = user;
