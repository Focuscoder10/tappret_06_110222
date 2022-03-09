/**
 * importations bibliothèques et fichier configuration
 */
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const path = require("path");

const env = require("./env");

const app = express();

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
app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }));

/**
 * middleware accès req.body
 */
app.use(express.json());

/**
 * Middleware d'authorisation des requêtes pour tout le monde(CORS)
 */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

/**
 * middleware qui sert les fichiers statiques du dossier images
 */
app.use("/images", express.static(path.join(__dirname, "images")));

/**définie les routers associés aux différents endpoint */
app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

/**
 * exporte l'application express
 */
module.exports = app;
