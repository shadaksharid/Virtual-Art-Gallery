const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const Artwork = require("../models/Artwork");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");

const sendOtp = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service : "gmail",
    auth: {
      user : process.env.EMAIL_USER,
      pass : process.env.EMAIL_PASS,
    },
  });

  const mail = {
    from : process.env.EMAIL_USER,
    to : email,
    subject : "Your OTP for Virtual Art Gallery",
    text : `Your OTP for Virtual Art Gallery is ${otp}. Valid for 10 minutes.`,
  }
  await transporter.sendMail(mail)
}
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, bio, gender } = req.body;

  try {
    
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = otpGenerator.generate(6, {digits: true,upperCaseAlphabets: false,lowerCaseAlphabets:false, specialChars: false});
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user = new User({
      name,
      email,
      password: hashedPassword,
      bio: bio || "",
      gender: gender || "",
      otp,
      otpExpires,
    });

    await user.save();
    await sendOtp(email, otp);
    const payload = {
      user: {
        id : user.id,
      }
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn : "1h"});
    res.json({token});
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const verifyOtp = async (req, res) => {
  const {email, otp} = req.body;
  try{
    const user = await User.findOne({email});
    if(!user){
      return res.status(400).json({msg : "User not found"});
    }
    if(user.otp != otp || new Date > user.otpExpires){
      return res.status.json({msg : "otp expired or invalid otp"})
    }
    const payload = {
      user: {
        id: user.id
      }
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
    user.isVerified = true,
    user.otp = undefined,
    user.otpExpires = undefined,

    await user.save();
    res.json({token, msg : "Account verified and registered"})
  }catch(err){
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const payload = {
      user: {
        id : user.id,
      }
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn : "1h"});

    const otp = otpGenerator.generate(6, {digits: true,upperCaseAlphabets: false,lowerCaseAlphabets:false, specialChars: false});
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp,
    user.otpExpires = otpExpires,
    await user.save();
    await sendOtp(email, otp)
    

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
const verifyLoginOtp = async (req, res) => {
  const {email, otp} = req.body;
  try{
    const user = await User.findOne({email})
    if(!user){
      return res.status(400).json({msg : "User not found"})
    }
    if(user.otp != otp || new Date > user.otpExpires){
      return res.status(400).json({msg : "OTP is not valid or expired"})
    }

    const payload = {
      user: {
        id : user.id,
      }
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn : "1h"});
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    res.json({token});
  }catch(err){
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const { bio, gender } = req.body;

    if (bio !== undefined) user.bio = bio;
    if (gender !== undefined) user.gender = gender;

    await user.save();
    res.json({ msg: "Profile updated successfully", user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password").populate("likedArtworks"); 
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const getUserLikedArtworks = async (req, res) => {
  try{
    const user = await User.findById(req.user.id).populate("likedArtworks");
    if(!user){
      return res.status(404).json({message: "User not found"});
    }
    res.json(user.likedArtworks);
  }catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserComments = async (req,res) => {
  try{
    const artworks = await Artwork.find({"comments.user" : req.user.id}, "title comments");
    const userComments = artworks.map(artwork => ({
      artworkTitle : artwork.title,
      comments : artwork.comments.filter(comment => comment.user.toString() === req.user.id)
    }));
    res.json(userComments);
  }catch (error) {
    res.status(500).json({ error: error.message });
}
}
const getUserUploadedArtworks = async (req, res) => {
  try {
      const user = await User.findById(req.user.id).populate({
        path: "uploadedArtworks",
        match: {status: "approved"}
      });
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }
      const approvedArtworks = user.uploadedArtworks.filter(artwork => artwork !== null);
      res.json(approvedArtworks);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};
module.exports = { register, verifyOtp, login, verifyLoginOtp, updateProfile, getUserProfile, getUserLikedArtworks, getUserComments, getUserUploadedArtworks };
