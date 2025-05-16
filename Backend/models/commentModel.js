const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Method to check if a user has liked the comment
commentSchema.methods.hasLiked = function(userId) {
    return this.likes.some(like => like.toString() === userId.toString());
};

// Method to add a like to the comment
commentSchema.methods.addLike = async function(userId) {
    if (!this.hasLiked(userId)) {
        this.likes.push(userId);
        return this.save();
    }
    return Promise.resolve(this);
};

// Method to remove a like from the comment
commentSchema.methods.removeLike = async function(userId) {
    this.likes = this.likes.filter(like => like.toString() !== userId.toString());
    return this.save();
};

// Method to add a reply to the comment
commentSchema.methods.addReply = async function(replyId) {
    this.replies.push(replyId);
    return this.save();
};

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;