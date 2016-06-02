const auth = require('../handlers/auth');

module.exports = [
    {
        method: 'GET',
        path: '/auth',
        handler: auth.googleAuth,
        config: {
            auth: false
        }
    }
];
