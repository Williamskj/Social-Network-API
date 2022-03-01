const { Schema, model } = require('mongoose');

const ReactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
        },
        reactionBody: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280
        },
        username: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        }
    }
);

ReactionSchema.methods.getDate = function () {
    const myDate = new Date(this.createdAt)
    return `${myDate.getMonth()} - ${myDate.getDate()} - ${myDate.getYear()}`
}

const ThoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [ReactionSchema],
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false
    }
);

ThoughtSchema.methods.getDate = function () {
    const myDate = new Date(this.createdAt)
    return `${myDate.getMonth()} - ${myDate.getDate()} - ${myDate.getYear()}`
}

const Thought = model('Thought', ThoughtSchema);

ThoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
});

module.exports = Thought;