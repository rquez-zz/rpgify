import Hapi from 'hapi';
import config from './app/config/rpgify';

import blipp from 'blipp';
import router from 'hapi-router';

var server = new Hapi.Server();

server.connection(config.connection);

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
}], (err) => {
    if (err) {
        console.log('Error registering hapi plugins');
        throw err;
    }
});

server.start(() => {
    console.log('Server running at: ' + config.connection.port);
});

export default server;
