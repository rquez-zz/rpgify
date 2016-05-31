var userHandler = require('../handlers/user');

module.exports = [
    {
        method: 'POST',
        path: '/user',
        config: {
            handler: userHandler.createUser,
            auth: false
        }
    },
    {
        method: 'PATCH',
        path: '/user',
        config: {
            handler: userHandler.updateUser
        }
    },
    {
        method: 'GET',
        path: '/user',
        config: {
            handler: userHandler.getUser
        }
    },
    {
        method: 'DELETE',
        path: '/user',
        config: {
            handler: userHandler.deleteUser
        }
    }
];

