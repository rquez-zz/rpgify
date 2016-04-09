import authHandler from '../handlers/auth';

export default [
    {
        method: 'GET',
        path: '/auth',
        config: {
            handler: authHandler.googleAuth,
            auth: false
        }
    }
];
