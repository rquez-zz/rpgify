import mongoose from 'mongoose';
import shortid from 'shortid';

var UserSchema = mongoose.Schema({
    _id: { type: String, unique: true, 'default': shortid.generate },
    username: { type: String, required: true },
    password: { type: String, required: true },
    lastLogin: Date,
    signup: { type: Date, default: Date.now },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    userExp: { type: Number, default: 0 },
    skills: [{
        skillName: String,
        levelCap: Number,
        currentLevel: { type: Number, default: 1 },
        lastUpdate: Date,
        skillType: String,
        skillColor: Number,
        expSkill: { type: Number, default: 0 },
        levels: [{
            number: Number,
            expToComplete: Number,
            tasks: [{
                objective: String,
                isDone: Boolean
            }]
        }]
    }]
});

export default mongoose.model('User', UserSchema);
