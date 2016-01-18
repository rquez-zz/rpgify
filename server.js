import Hapi from 'hapi';
import config from './app/config/rpgify';
import jwt from './app/helpers/jwt';
import db from './app/helpers/db';

import fs from 'fs';
import blipp from 'blipp';
import router from 'hapi-router';
import hapiAuthJwt from 'hapi-auth-jwt';

var server = new Hapi.Server();
var key = fs.readFileSync(config.key.path);

server.connection(config.connection);

// Register plugins, routes, and jwt authentication
server.register([{
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
