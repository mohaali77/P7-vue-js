const mongoose = require('mongoose');

//on construit notre schéma de données pour nos posts
const postSchema = mongoose.Schema({
    userId: { type: String, required: true },
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    content: { type: String, required: true },
    //imageUrl: { type: String, required: true },
    likes: { type: Number, default: 0 },
    usersLiked: { type: [String] },
});

//on exporte le modèle 
module.exports = mongoose.model('Post', postSchema);