const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    //TODO: add email address to schema and adapt route as necessary
    password: {
        type: String,
        required: true
    },
    roles: [],
    portfolioId: {
        type: Schema.Types.ObjectId,
        ref: 'Portfolio'
    }
});

userSchema.methods.generateHash = function(password) {
    return this.password = bcrypt.hashSync(password, 8);
};

userSchema.methods.compareHash = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
