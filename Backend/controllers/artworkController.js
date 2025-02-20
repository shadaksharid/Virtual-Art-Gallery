const Artwork = require("../models/Artwork");

const addArtwork = async (req, res) => {
    try{
        const {title, artist, description} = req.body;
        const imageUrl = req.file.path;

        const newArtwork = new Artwork({title, artist, imageUrl, description});
        await newArtwork.save();

        res.status(201).json({message : "Artwork added successfully" , artwork : newArtwork});
    }catch(error){
        res.status(500).json({error : error.message} );
    }
};

const getArtworks = async (req, res) => {
    try{
        const artworks = await Artwork.find();
        res.status(200).json(artworks);
    }catch(error){
        res.status(500).json({error : error.message});
    }
};

const getArtworkById = async (req, res) => {
    try{
        const artwork = await Artwork.findById(req.params.id);
        if(!artwork) {
            return res.status(404).json({message : "Artwork not found"})
        }
        res.status(200).json(artwork);
    }catch(error){
        res.status(500).json({error : error.message});
    }
};

const likeArtwork = async (req, res) => {
    try{
        const artwork = await Artwork.findById(req.params.id);
        if(!artwork){
            return res.status(404).json({message: "Artwork not found"})
        }
        artwork.likes += 1;
        await artwork.save();

        res.status(200).json({message: "art liked"})
    }catch(error){
        res.status(500).json({error: "error message"});
    }
}
module.exports = {addArtwork, getArtworks, getArtworkById, likeArtwork};