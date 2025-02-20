const express = require('express');
const router = express.Router();
const {upload} = require('../config/cloudinary');
const {addArtwork, getArtworks, getArtworkById, likeArtwork} = require("../controllers/artworkController");

router.post("/upload", upload.single('image'), addArtwork);
router.get("/", getArtworks);
router.get("/:id", getArtworkById);
router.put("/:id/like", likeArtwork);

module.exports = router;