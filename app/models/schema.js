var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

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
    var config = require('../config/rpgify');
    return bcrypt.hashSync(password, config.bcrypt.workFactor);
};

UserSchema.methods.isValidPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
