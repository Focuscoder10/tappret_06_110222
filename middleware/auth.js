/**
 * importation de la bibliothèque jsonwebtoken
 */
const jsToken = require("jsonwebtoken");

/**
 * importation de la configuration
 */
const env = require("../env");

/**
 * middleware d'authentification
 */
module.exports = (req, res, next) => {
  try {
    /**
     * vérifie la présence d'un headers authentification
     * vérifie si il est splitable
     */
    const token = req.headers.authorization.split(" ")[1];

    /**
     * vérifie que le token est bien décriptable avec la clé secrète
     */
    const decodedToken = jsToken.verify(token, env.secret);
    const userId = decodedToken.userId;

    /**
     * ajoute un objet auth à la requête qui contient l'userId
     */
    req.auth = { userId };

    /**
     * vérifie que l'userId du body correspond à l'userId du token
     */
    if (req.body.userId && req.body.userId !== userId) throw new Error("Invalid User ID");

    /**
     * si tout est ok passe au middleware suivant
     */
    next();

    /**
     * sinon retourne erreur 401
     */
  } catch (error) {
    res.status(401).json({ error: error.name === "Error" ? error.message : "Unauthorized" });
  }
};
