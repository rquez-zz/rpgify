import server from '../../server';

export default {
    googleAuth: (req, reply) => {
        var authUrl = server.generate_google_oauth2_url();
        reply().redirect(authUrl);
    },
    //TODO: Implement user mapping
    authHandler: (req, reply, tokens, profile) => {
        reply();
    }
};
