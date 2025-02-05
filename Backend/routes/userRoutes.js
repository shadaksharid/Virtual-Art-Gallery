
const express = require("express");
const { signup, login } = require("../controllers/userController");
const { body } = require("express-validator");
const router = express.Router();


router.post(
  "/signup",
  [
    body("name", "Name is required").not().isEmpty(),
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password must be at least 6 characters").isLength({ min: 6 })
  ],
  signup
);


router.post(
  "/login",
  [
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password is required").exists()
  ],
  login
);

module.exports = router;
