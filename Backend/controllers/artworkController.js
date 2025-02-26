const Artwork = require("../models/Artwork");
const User = require("../models/User");

const addArtwork = async (req, res) => {
    try {
        const { title, artist, description } = req.body;
        const imageUrl = req.file.path;

        const newArtwork = new Artwork({
            title,
            artist,
            imageUrl,
            description,
            status: "pending" 
        });
        await newArtwork.save();

        res.status(201).json({ message: "Artwork added successfully, pending approval", artwork: newArtwork });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getArtworks = async (req, res) => {
    try {
        const artworks = await Artwork.find({ status: "approved" }) 
            .populate("likes", "name")
            .populate("comments.user", "name");
        res.status(200).json(artworks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getArtworkById = async (req, res) => {
    try {
        const artwork = await Artwork.findById(req.params.id)
            .populate("likes", "name")
            .populate("comments.user", "name");

        if (!artwork) {
            return res.status(404).json({ message: "Artwork not found" });
        }

        if (artwork.status !== "approved") {
            return res.status(403).json({ message: "This artwork is not approved yet" });
        }

        res.status(200).json(artwork);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const likeArtwork = async (req, res) => {
    try {
        const userId = req.user.id;
        const artworkId = req.params.id;

        const artwork = await Artwork.findById(artworkId);
        if (!artwork || artwork.status !== "approved") {
            return res.status(404).json({ message: "Artwork not found or not approved yet" });
        }

        const user = await User.findById(userId);

        if (artwork.likes.includes(userId)) {
            artwork.likes = artwork.likes.filter(id => id.toString() !== userId);
            user.likedArtworks = user.likedArtworks.filter(id => id.toString() !== artworkId);
            await artwork.save();
            await user.save();
            return res.json({ message: "Artwork unliked", artwork });
        }

        artwork.likes.push(userId);
        user.likedArtworks.push(artworkId);
        await artwork.save();
        await user.save();
        res.json({ message: "Art Liked", artwork });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const commentOnArtwork = async (req, res) => {
    try {
        const { text } = req.body;
        const userId = req.user.id;
        const artworkId = req.params.id;

        if (!text) {
            return res.status(400).json({ message: "Comment text required" });
        }

        const artwork = await Artwork.findById(artworkId);
        if (!artwork || artwork.status !== "approved") {
            return res.status(404).json({ message: "Artwork not found or not approved yet" });
        }

        const comment = { user: userId, text };
        artwork.comments.push(comment);
        await artwork.save();
        res.json({ message: "Comment added", artwork });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { addArtwork, getArtworks, getArtworkById, likeArtwork, commentOnArtwork };
