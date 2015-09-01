import Hapi from 'hapi';
import config from './app/config/rpgify';

var server = new Hapi.Server();

server.connection(config.connection);

server.start(() => {
    console.log('Server running at: ' + config.connection.port);
});
