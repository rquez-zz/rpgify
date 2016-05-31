var loginHandler = require('../handlers/login');

module.exports = [
    {
        method: 'POST',
        path: '/login',
        handler: loginHandler.login,
        config: {
            auth: false
        }
    }
];
