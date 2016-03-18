import Hapi from 'hapi';
import config from './app/config/rpgify';
import jwt from './app/helpers/jwt';
import db from './app/helpers/db';
import auth from './app/handlers/auth';

import fs from 'fs';
import blipp from 'blipp';
import router from 'hapi-router';
import hapiAuthJwt from 'hapi-auth-jwt';
import hapiAuthGoogle from 'hapi-auth-google';

var server = new Hapi.Server();

var key = fs.readFileSync(config.key.path);

var apiKey = fs.readFileSync(config.apiKey.path);
var apiKeyJson = JSON.parse(apiKey);

process.env.GOOGLE_CLIENT_ID = apiKeyJson.web.client_id;
process.env.GOOGLE_CLIENT_SECRET = apiKeyJson.web.client_secret;
process.env.BASE_URL = config.baseUrl;
process.env.PORT = config.connection.port;

server.connection(config.connection);

config.googleOpts.handler = auth.authHandler;

server.register([{
    register: hapiAuthGoogle,
    options: config.googleOpts
},{
    register: blipp,
    options: {
        showAuth: true
    }
}, {
    register: router,
    options: {
        routes: './app/routes/*.js'
    }
}, {
    register: hapiAuthJwt,
}], (err) => {
    if (err) {
        console.log('Error registering hapi plugins');
        throw err;
    }
    server.auth.strategy('token', 'jwt', 'required', {
        validateFunc: jwt.validateToken,
        key: key
    });
});

server.start(() => {
    console.log('Server running at: ' + config.connection.port);
});

export default server;
