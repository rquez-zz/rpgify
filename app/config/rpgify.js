var env = process.env;

export default {
    connection: { port: env.PORT || 3000 },
    baseUrl: env.BASE_URL || 'http://localhost:3000',
    key: { path: env.PRIVATEKEY || 'privateKey' },
    apiKey: { path: env.APIKEY || 'googleApiKey.json'},
    jwt: { issuer: 'rpgify' },
    mongodb: { url:  'mongodb://localhost/rpgify' },
    bcrypt: { workFactor: env.WORK_FACTOR || 10 },
    patchable: {
        user: ['username', 'password', 'email', 'name']
    },
    getable: {
        user: 'username name email skills userExp signup lastLogin -_id'
    },
    googleOpts: {
        REDIRECT_URL: '/auth-callback',
        scope: 'https://www.googleapis.com/auth/plus.profile.emails.read'
    }
};
