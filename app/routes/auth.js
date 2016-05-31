var auth = require('../handlers/auth');

module.exports = [
    {
        method: 'GET',
        path: '/auth',
        config: {
            handler: authHandler.googleAuth,
            auth: false
        }
    }
];
