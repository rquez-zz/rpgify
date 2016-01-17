import config from '../config/rpgify';
import mongoose from 'mongoose';

mongoose.connect(config.mongodb.url);

mongoose.connection.on('connected', () => {
    console.log('Mongoose default connection open to ' + config.mongodb.url);
});

mongoose.connection.on('error', (err) => {
    console.log('Mongoose default connection error: ' + err);
});

mongoose.connection.on('disconnected', (err) => {
    console.log('Mongoose default connection disconnected: ' + err);
});

process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});
