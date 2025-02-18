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


module.exports = {addArtwork, getArtworks, getArtworkById};