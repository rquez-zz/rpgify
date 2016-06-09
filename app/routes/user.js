const userHandler = require('../handlers/user');

module.exports = [
    {
        method: 'POST',
        path: '/user',
        handler: userHandler.createUser,
        config: {
            auth: false
        }
    },
    {
        method: 'PUT',
        path: '/user',
        handler: userHandler.updateUser
    },
    {
        method: 'GET',
        path: '/user',
        handler: userHandler.getUser
    },
    {
        method: 'DELETE',
        path: '/user',
        handler: userHandler.deleteUser
    }
];

