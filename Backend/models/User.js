const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    default: ""
  },
  gender: {
    type: String,
    enum: ["male", "female", ""],
    default: ""
  },
  likedArtworks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Artwork"
  }],
  uploadedArtworks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Artwork"
  }],
  isVerified : {
    type: Boolean,
    default: false,
  },
  otp : {
    type: String,
  },
  otpExpires : {
    type: Date,
  }
});

module.exports = mongoose.model("User", userSchema);
