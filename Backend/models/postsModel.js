const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    ingredients: [
      {
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: String,
          required: true,
        },
      },
    ],
    instructions: [
      {
        step: {
          type: String,
          required: true,
        },
      },
    ],
    cookingTime: {
      type: Number,
      required: true,
    },
    prepTime: {
      type: Number,
      required: true,
    },
    servings: {
      type: Number,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    cuisine: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Method to check if a user has liked the post
postSchema.methods.hasLiked = function (userId) {
  return this.likes.some((like) => like.toString() === userId.toString());
};

// Method to add a like to the post
postSchema.methods.addLike = async function (userId) {
  if (!this.hasLiked(userId)) {
    this.likes.push(userId);
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to remove a like from the post
postSchema.methods.removeLike = async function (userId) {
  this.likes = this.likes.filter(
    (like) => like.toString() !== userId.toString()
  );
  return this.save();
};

// Method to add a comment to the post
postSchema.methods.addComment = async function (commentId) {
  this.comments.push(commentId);
  return this.save();
};

// Method to remove a comment from the post
postSchema.methods.removeComment = async function (commentId) {
  this.comments = this.comments.filter(
    (comment) => comment.toString() !== commentId.toString()
  );
  return this.save();
};

// Update updatedAt field whenever the document is modified
postSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
