const Joi = require('joi');
const fixtures = require('./fixtures');

const routes ={
    login: {
        tags: ['api'],
        post: {
            description: 'Sign in',
            notes: ['Sign in the user with an email and password. Returns a valid JWT to be used with other API requests. JWT bearer authorization is not required.']
        }
    },
    user: {
        tags: ['api'],
        post: {
            description: 'Create User',
            notes: ['Create a new user with a email, name, and password. Email must be unique in the system. JWT bearer authorization is not required.']
        },
        get: {
            description: 'Get User',
            notes: ['Returns all the user\'s information. `lastLogin` and `signup` and in ISO date standard. JWT bearer authorization is required']
        },
        put: {
            description: 'Update User',
            notes: ['Updates the user\'s information. JWT bearer authorization is required.']
        },
        delete: {
            description: 'Delete User',
            notes: ['Deletes the user and their information from the system. JWT bearer authorization is required.']
        }
    }
};

const schemas = {
    authorization:
        Joi.object({
            authorization: Joi.string().required().default('Bearer {insert jwt here}')
        }).unknown(),
    login: {
        post: {
            payload:
                Joi.object({
                    email: Joi.string().default(fixtures.email).required(),
                    password: Joi.string().default(fixtures.password).required()
                }).description('Credentials to sign in and receive a JWT.')
                .label('Credentials'),
            response:
                Joi.object({
                    jwt: Joi.string().default(fixtures.jwt)
                })
        }
    },
    user: {
        post: {
            payload:
                Joi.object({
                    email: Joi.string().default(fixtures.email).required(),
                    name: Joi.string().default(fixtures.name).required(),
                    password: Joi.string().default(fixtures.password).required()
                }).description('New user object.').label('Create User'),
            response:
                Joi.object({
                    email: Joi.string().default(fixtures.email).required(),
                    name: Joi.string().default(fixtures.name).required(),
                }).description('New user object.').label('Create User')
        },
        put: {
            payload:
                Joi.object({
                    email: Joi.string().default(fixtures.email),
                    name: Joi.string().default(fixtures.name),
                }).description('Update user object').label('Update User')
        },
        get: {
            response:
                Joi.object({
                    email: Joi.string().default(fixtures.email),
                    name: Joi.string().default(fixtures.name),
                    userExp: Joi.number().default(0),
                    signup: Joi.date().iso().default((new Date()).toISOString()),
                    lastLogin: Joi.date().iso().default((new Date()).toISOString()),
                })
        }
    }
};

const responses = {
    login: {
        post: {
            responses: {
                '200': {
                    description: 'JWT successfully created and returned.',
                    schema: schemas.login.post.response
                },
                '401': {
                    description: 'Invalid email/password supplied.'
                },
                '404': {
                    description: 'User not found.'
                },
                '409': {
                    description: 'A user that signed up using Google attempts to login with a email/password'
                },
                '422': {
                    description: 'Credentials payload that was sent is malformed.'
                },
                '500': {
                    description: 'Error finding user or updating user login metadata.'
                }
            }
        }
    },
    user: {
        post: {
            responses: {
                '201': {
                    description: 'New user was successfully created.',
                    schema: schemas.user.post.response,
                    headers: {
                        location: {
                            description: 'Where to get the user.',
                            type: 'string'
                        }
                    }
                },
                '409': {
                    description: 'User already exists with the given email.'
                },
                '422': {
                    description: 'User creation payload that was malformed.'
                },
                '500': {
                    description: 'Error saving user to database.'
                }
            }
        },
        put: {
            security: [{ 'jwt': [] }],
            responses: {
                '204': {
                    description: 'User was successfully updated.'
                },
                '401': {
                    description: 'Missing or invalid JWT.'
                },
                '422': {
                    description: 'Payload contains one or more invalid fields.'
                },
                '500': {
                    description: 'Error updating user in database.'
                }
            }
        },
        get: {
            security: [{ 'jwt': [] }],
            responses: {
                '200': {
                    description: 'User was successfully returned.',
                    schema: schemas.user.get.response
                },
                '401': {
                    description: 'Missing or invalid JWT.'
                },
                '404': {
                    description: 'User not found.'
                },
                '500': {
                    description: 'Error getting user in database.'
                }
            }
        },
        delete: {
            security: [{ 'jwt': [] }],
            responses: {
                '204': {
                    description: 'User was successfully updated.',
                },
                '401': {
                    description: 'Missing or invalid JWT.'
                },
                '404': {
                    description: 'User not found.'
                },
                '500': {
                    description: 'Error deleting the user.'
                }
            }
        }
    }
};

const swagger = {
    options: {
        info: {
            title: 'RPGify',
            description: 'API Documentation',
            version: require('./../../package.json').version,
            contact: {
                name: 'Ricardo Vasquez',
                email: 'rvzxjr@gmail.com'
            },
            license: {
                name: 'GNU General Public License'
            }
        },
        securityDefinitions: {
            jwt: {
                type: 'apiKey',
                name: 'Authorization',
                in: 'header'
            }
        },
    },
    routes,
    schemas,
    responses
};

module.exports = swagger;
