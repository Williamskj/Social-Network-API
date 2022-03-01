const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/]
    },
    thoughts: [{ type: Schema.Types.ObjectId, ref: 'Thought' }],
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }]
},
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    });

const User = model('User', UserSchema);

UserSchema.virtual('friendCount').get(function () {
    return this.friends.length;
});

module.exports = User;