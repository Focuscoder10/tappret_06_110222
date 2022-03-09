/**
 * Importation bibliothèque
 */
const mongoose = require("mongoose");

/**
 * Construction du modèle sauce
 */
const schema = mongoose.Schema({
  userId: { type: String, required: true }, 
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, required: true },
  dislikes: { type: Number, required: true },
  usersLiked: { type: [String] , required: true },
  usersDisliked: { type: [String] , required: true },
});

/**
 * export du modèle
 */
module.exports = mongoose.model("Sauce", schema);