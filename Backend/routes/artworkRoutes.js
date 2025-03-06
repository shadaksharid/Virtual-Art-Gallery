const express = require('express');
const router = express.Router();
const {upload} = require('../config/cloudinary');
const {addArtwork, getArtworks, getArtworkById, likeArtwork, commentOnArtwork, addReply} = require("../controllers/artworkController");
const auth = require("../middeware/authMiddleware");

router.post("/upload", auth,upload.single('image'), addArtwork);
router.get("/", auth,getArtworks);
router.get("/:id", getArtworkById);
router.post("/:id/like", auth, likeArtwork); 
router.post("/:id/comment", auth, commentOnArtwork); 
router.post("/:id/comment/:commentId/reply", auth, addReply);
module.exports = router;