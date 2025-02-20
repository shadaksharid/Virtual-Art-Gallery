const mongoose = require('mongoose');

const ArtworkSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    artist:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        required:true
    },
    description: {  
        type: String,
        required: false
    },
    likes : {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model("Artwork", ArtworkSchema);