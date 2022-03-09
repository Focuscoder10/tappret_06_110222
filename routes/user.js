/**
 * importation bibliothèque express
 */
const express = require("express");

/**
 * création du router
 */
const router = express.Router();

/**
 * importation du controller "utilisateur"
 */
const userCtrl = require("../controllers/user");

const limiter = require("../middleware/limiter-auth");

/**
 * création routes d'enregistrement et d'authentification
 */
router.post("/signup", limiter, userCtrl.signup);

router.post("/login", limiter, userCtrl.login);

/**
 * exportation du router
 */
module.exports = router;
