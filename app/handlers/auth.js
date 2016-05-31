var User = require('../models/schema');

var Boom = require('boom');

module.exports = {
    googleAuth: (req, reply) => {
            var server = require('../../server');
            var authUrl = server.generate_google_oauth2_url();
            reply().redirect(authUrl);
    },
    authHandler: (req, reply, tokens, profile) => {

        var jwt = require('../helpers/jwt');
        var email = profile.emails[0].value;

        User.findOne({'email': email}, (err, existingUser) => {

            // Return a JWT if user exists, else create the user
            if (existingUser) {
                var token = {
                    email: email,
                    _id: existingUser._id
                };
                existingUser.update( { lastLogin: Date.now() }, (err, res) => {
                    if (err)
                        return reply(Boom.badImplementation('Error updating user from db', err));
                    return reply(jwt.sign(token));
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
