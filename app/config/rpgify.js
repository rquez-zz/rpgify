var env = process.env;

export default {
    connection: {
        port: env.PORT || 3000
    },
    keyfile: env.PRIVATEKEY || 'privateKey',
    jwtOpts: {
        issuer: 'rpgify'
    }
};
