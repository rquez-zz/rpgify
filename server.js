var Hapi = require('hapi');
var fs = require('fs');

var jwt = require('./app/helpers/jwt');
var config = require('./app/config/rpgify');
var db = require('./app/helpers/db');

const server = new Hapi.Server();

const key = fs.readFileSync(config.key.path);
const apiKeyJson = JSON.parse(fs.readFileSync(config.apiKey.path));

process.env.GOOGLE_CLIENT_ID = apiKeyJson.web.client_id;
process.env.GOOGLE_CLIENT_SECRET = apiKeyJson.web.client_secret;
process.env.BASE_URL = config.baseUrl;
process.env.PORT = config.connection.port;

server.connection(config.connection);

server.register([{
    register: require('hapi-auth-google'),
    options: config.googleOpts
},{
    register: require('blipp'),
    options: {
        showAuth: true
    }
}, {
    register: require('hapi-router'),
    options: {
        routes: './app/routes/*.js'
    }
}, {
    register: require('hapi-auth-jwt'),
}], (err) => {
    if (err) {
        console.log('Error registering hapi plugins');
        throw err;
    }
    server.auth.strategy('jwt', 'jwt', 'required', {
        validateFunc: jwtHelper.validateToken,
        key: key
    });
});

server.start(() => {
    console.log('Server running at: ' + config.connection.port);
});

module.exports = server;
