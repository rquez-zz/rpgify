import loginHandler from '../handlers/login';

export default [
    {
        method: 'POST',
        path: '/login',
        config: {
            handler: loginHandler.login,
            auth: false
        }
    }
];
