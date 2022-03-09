/**
 * Importation bibliothèque
 */
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

/**
 * Construction du modèle de donnée
 */
const schema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

/**
 * Ajoute une contrainte d'unicité sur l'email
 */
schema.plugin(uniqueValidator);

/**
 * Export du modèle
 */
module.exports = mongoose.model("User", schema);
