const express = require('express');
const router = express.Router();
const {upload} = require('../config/cloudinary');
const {addArtwork, getArtworks, getArtworkById} = require("../controllers/artworkController");

router.post("/upload", upload.single('image'), addArtwork);
router.get("/", getArtworks);
router.get("/:id", getArtworkById);

module.exports = router;