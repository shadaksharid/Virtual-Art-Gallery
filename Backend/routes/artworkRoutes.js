const express = require('express');
const router = express.Router();
const {upload} = require('../config/cloudinary');
const {addArtwork, getArtworks, getArtworkById, likeArtwork, commentOnArtwork} = require("../controllers/artworkController");
const auth = require("../middeware/authMiddleware");

router.post("/upload", upload.single('image'), addArtwork);
router.get("/", getArtworks);
router.get("/:id", getArtworkById);
router.post("/:id/like", auth, likeArtwork); 
router.post("/:id/comment", auth, commentOnArtwork); 
module.exports = router;