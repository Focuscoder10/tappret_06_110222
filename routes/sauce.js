/**
 * importation bibliothèque express
 */
const express = require("express");

/**
 * création du router
 */
const router = express.Router();

/**
 * importation du controller "sauce"
 * logique métier
 */
const sauceCtrl = require("../controllers/sauce");

/**
 *  importation du middleware d'authentification
 */
const auth = require("../middleware/auth");

/**
 * importation du middleware de téléversement d'images
 */
const multer = require("../middleware/multer");

const limiter = require("../middleware/limiter-generic");

/**
 * création des routes et assignation des middleware
 */
// Creation d'une sauce
router.post("/", limiter, auth, multer, sauceCtrl.create);
// Gestion des likes/dislikes
router.post("/:id/like", limiter, auth, sauceCtrl.like);
// Afficher la liste des sauces
router.get("/", limiter, auth, sauceCtrl.list);
// Afficher une sauce
router.get("/:id", limiter, auth, sauceCtrl.get);
// Editer la sauce
router.put("/:id", limiter, auth, multer, sauceCtrl.modify);
// Supprimer la sauce
router.delete("/:id", limiter, auth, sauceCtrl.delete);

/**
 * exportation du router
 */
module.exports = router;