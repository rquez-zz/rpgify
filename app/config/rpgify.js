var env = process.env;

const config = {
    connection: {
        port: env.PORT || 3000
    },
    baseUrl: env.BASE_URL || 'http://localhost:3000',
    key: {
        path: env.PRIVATEKEY || 'privateKey'
    },
    apiKey: {
        path: env.APIKEY || 'googleApiKey.json'
    },
    jwt: {
        issuer: 'rpgify'
    },
    mongodb: {
        url:  'mongodb://localhost/rpgify'
    },
    bcrypt: {
        workFactor: env.WORK_FACTOR || 10
    },
    patchable: {
        user: ['password', 'email', 'name']
    },
    getable: {
        user: 'name email skills userExp signup lastLogin -_id'
    },
    googleOpts: {
        REDIRECT_URL: '/auth-callback',
        handler: require('../handlers/auth').authHandler,
        scope: 'https://www.googleapis.com/auth/plus.profile.emails.read'
    }
};

module.exports = config;
