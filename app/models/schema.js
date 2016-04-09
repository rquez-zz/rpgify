import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

var SALT_WORK_FACTOR = 10;

var UserSchema = mongoose.Schema({
    password: { type: String },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    lastLogin: Date,
    signup: { type: Date, default: Date.now },
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

UserSchema.statics.hashPassword = function(password) {
    return bcrypt.hashSync(password, SALT_WORK_FACTOR);
};

UserSchema.methods.isValidPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

export default mongoose.model('User', UserSchema);
