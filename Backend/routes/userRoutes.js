
const express = require("express");
const { register, login } = require("../controllers/userController");
const { body } = require("express-validator");
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
  "/login",
  [
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password is required").exists()
  ],
  login
);

module.exports = router;
