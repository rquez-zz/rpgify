const loginHandler = require('../handlers/login');
const swagger = require('../config/swagger');
const Boom = require('boom');

var login = {
    method: 'POST',
    path: '/login',
    handler: loginHandler.login,
    config: {
        auth: false,
        tags: swagger.routes.login.tags,
        description: swagger.routes.login.post.description,
        notes: swagger.routes.login.post.notes,
        plugins: {
            'hapi-swagger': swagger.responses.login.post
        },
        validate: {
            payload: swagger.schemas.login.post.payload,
            failAction: (req, reply, src, error) => {
                reply(Boom.badData(error.data));
            }
        }
    }
};

module.exports = login;
