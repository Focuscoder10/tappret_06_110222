/**
 * importations bibliothèques et fichier configuration
 */
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const path = require("path");
const cors = require("./middleware/cors");
const fs = require("fs");

const env = require("./env");

const app = express();

/**
 * Creation du dossier images s'il n'existe pas
 * Arrête l'application si une erreur se produit
 */
fs.exists("images", exists => {
  if (!exists)
    fs.mkdir("images", error => {
      if (error) {
        console.error(error);
        process.exit(1);
      }
    });
});

/**
 * importations des routes requises
 */
const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");

/**
 * Connexion base de données
 */
mongoose
  .connect(
    `mongodb+srv://${env.user}:${env.pass}@${env.host}/${env.base}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connection to MongoDB successful"))
  .catch(() => console.error("Connection to MongoDB failed"));

/**
 * middleware de sécurité
 */
app.use(helmet());

/**
 * middleware accès req.body
 */
app.use(express.json());

/**
 * Middleware d'authorisation des requêtes pour tout le monde(CORS)
 */
app.use(cors);

/**
 * middleware qui sert les fichiers statiques du dossier images
 */
app.use(
  "/images",
  helmet.crossOriginResourcePolicy({ policy: "cross-origin" }),
  express.static(path.join(__dirname, "images"))
);

/**définie les routers associés aux différents endpoint */
app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

/**
 * exporte l'application express
 */
module.exports = app;
