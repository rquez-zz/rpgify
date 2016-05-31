var skillsHandler = require('../handlers/skills');

module.exports = [
    {
        method: 'GET',
        path: '/skills',
        config: {
            handler: skillsHandler.getSkills
        }
    },
    {

        method: 'POST',
        path: '/skills',
        config: {
            handler: skillsHandler.createSkill
        }
    },
    {
        method: 'PATCH',
        path: '/skills/{skillname}',
        config: {
            handler: skillsHandler.updateSkill
        }
    },
    {
        method: 'DELETE',
        path: '/skills/{skillname}',
        config: {
            handler: skillsHandler.deleteSkill
        }
    },
];
