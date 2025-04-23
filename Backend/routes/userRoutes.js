
const express = require("express");
const { register, login, updateProfile, getUserProfile, getUserLikedArtworks,getUserComments, getUserUploadedArtworks, verifyOtp, verifyLoginOtp } = require("../controllers/userController");
const { body } = require("express-validator");
const auth = require("../middeware/authMiddleware");
const router = express.Router();


router.post(
  "/register",
  [
    body("name", "Name is required").not().isEmpty(),
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password must be at least 6 characters").isLength({ min: 6 })
  ],
  register
);

router.post(
  "/verify-otp",
  [
    body("email", "valid email is required").isEmail(),
    body("otp", "valid otp is required").isLength({min : 6, max : 6})
  ],
  verifyOtp
)

router.post(
  "/login",
  [
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password is required").exists()
  ],
  login
);
router.post(
  "/verify-login-otp",
  [
    body("email","enter valid password").isEmail(),
    body("otp","enter valid otp or otp expired").isLength({min: 6, max: 6})
  ],
  verifyLoginOtp
)
router.put(
  "/profile",
  auth, 
  [
    body("bio").optional().isString(),
    body("gender").optional().isIn(["male", "female"])
  ],
  updateProfile
);
router.get("/profile", auth,getUserProfile);
router.get("/profile/liked-artworks", auth, getUserLikedArtworks); 
router.get("/profile/comments", auth, getUserComments); 
router.get("/profile/uploaded-artworks", auth, getUserUploadedArtworks);
module.exports = router;
