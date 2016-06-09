const skillsHandler = require('../handlers/skills');

module.exports = [
    {
        method: 'GET',
        path: '/skills',
        handler: skillsHandler.getSkills
    },
    {

        method: 'POST',
        path: '/skills',
        handler: skillsHandler.createSkill
    },
    {
        method: 'PATCH',
        path: '/skills/{skillname}',
        handler: skillsHandler.updateSkill
    },
    {
        method: 'DELETE',
        path: '/skills/{skillname}',
        handler: skillsHandler.deleteSkill
    },
];
