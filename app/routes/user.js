const userHandler = require('../handlers/user');
const swagger = require('../config/swagger');
const Boom = require('boom');

module.exports = [
    {
        method: 'POST',
        path: '/user',
        handler: userHandler.createUser,
        config: {
            auth: false,
            tags: swagger.routes.user.tags,
            description: swagger.routes.user.post.description,
            notes: swagger.routes.user.post.notes,
            plugins: {
                'hapi-swagger': swagger.responses.user.post
            },
            validate: {
                payload: swagger.schemas.user.post.payload,
                failAction: (req, reply, src, error) => {
                    reply(Boom.badData(error.data));
                }
            }
        }
    },
    {
        method: 'PUT',
        path: '/user',
        handler: userHandler.updateUser,
        config: {
            tags: swagger.routes.user.tags,
            description: swagger.routes.user.put.description,
            notes: swagger.routes.user.put.notes,
            plugins: {
                'hapi-swagger': swagger.responses.user.put
            },
            validate: {
                payload: swagger.schemas.user.put.payload,
                headers: swagger.schemas.authorization,
                failAction: (req, reply, src, error) => {
                    reply(Boom.badData(error.data));
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/user',
        handler: userHandler.getUser,
        config: {
            tags: swagger.routes.user.tags,
            description: swagger.routes.user.get.description,
            notes: swagger.routes.user.get.notes,
            plugins: {
                'hapi-swagger': swagger.responses.user.get
            },
            validate: {
                headers: swagger.schemas.authorization
            }
        }
    },
    {
        method: 'DELETE',
        path: '/user',
        handler: userHandler.deleteUser,
        config: {
            tags: swagger.routes.user.tags,
            description: swagger.routes.user.delete.description,
            notes: swagger.routes.user.delete.notes,
            plugins: {
                'hapi-swagger': swagger.responses.user.delete
            },
            validate: {
                headers: swagger.schemas.authorization
            }
        }
    }
];

