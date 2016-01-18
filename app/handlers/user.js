import User from '../models/schema.js';
import bcrypt from 'bcrypt';
import config from '../config/rpgify';

var SALT_WORK_FACTOR = 10;

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
    deleteUser: () => {}
};
