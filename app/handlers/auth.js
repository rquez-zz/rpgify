const User = require('../models/schema');

const Boom = require('boom');

const auth = {
    googleAuth: (req, reply) => {
        const authUrl = require('../../server').generate_google_oauth2_url();
        reply().redirect(authUrl);
    },
    authHandler: (req, reply, tokens, profile) => {
        const jwt = require('../helpers/jwt');
        var email = profile.emails[0].value;

        User.findOne({'email': email}, (err, existingUser) => {

            if (existingUser) {
                var token = {
                    email: email,
                    _id: existingUser._id
                };

                existingUser.update( { lastLogin: Date.now() }, (err, res) => {
                    if (err)
                        return reply(Boom.badImplementation('Error updating user from db', err));
                    return reply({ jwt: jwt.sign(token) });
                });
            } else {
                var newUser = new User({
                    name: profile.displayName,
                    email: email
                });

                newUser.save(err => {
                    if (err)
                        return reply(Boom.badImplementation('Error saving user to db', err));

                    return reply().code(201);
                });
            }
        });
    }
};

module.exports = auth;
