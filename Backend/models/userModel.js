const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  First_Name: {
    type: String,
    //required: [true, "Please provide your name"],
    trim: true,
  },
  Last_Name: {
    type: String,
    //required: [true, "Please provide your name"],
    trim: true,
  },
  Username: {
    type: String,
    //required: [true, "Please provide a username"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    //required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
  },
    Phone_Number: {
    type: Number,
    //required: [true, "Please provide your phone number"],
    },
    Date_Of_Birth: {
    type: Date,
    //required: [true, "Please provide your date of birth"],
    },
    City: {
      type:String,
      //required: true,
    },
    Country:{
      type:String,
      //required: true,
    },
  password: {
    type: String,
    //required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  role: {
    type: String,
    enum: ["user", "agent", "admin", "superadmin"],
    default: "user",
  },
  properties: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      default: [],
    },
  ],
  wishList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      default: [],
    },
  ],
  userAvatar:{
    type: String,
    default: "default.jpg",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// userSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "properties",
//     select: "Title Price",
//   });
//   next();
// });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});



// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
