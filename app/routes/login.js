var loginHandler = require('../handlers/login');

module.exports = [
    {
        method: 'POST',
        path: '/login',
        config: {
            handler: loginHandler.login,
            auth: false
        }
    }
];
