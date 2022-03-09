/**
 * Importation du modèle
 */
const Sauce = require("../models/Sauce");

/**
 * Importation Bibliothèque
 */
const fs = require("fs");

/**
 * Funtion création d'une nouvelle sauce
 */
exports.create = (req, res, next) => {
  // json parse requis car présence d'un fichier image en plus de l'objet sauce
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  /**
   * crée une nouvelle instance du modèle sauce
   * il contiendra tout les attributs de sauceObject plus l'img et l'initialisation
   * des likes et dislikes
   */
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce created" }))
    .catch(error => res.status(400).json({ error: "Bad Request" }));
};

/**
 * retourne une liste des objets sauces de la base de données
 */
exports.list = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error: "Bad Request" }));
};

/**
 * récupère une sauce par son ID
 */
exports.get = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error: "Bad Request" }));
};

/**
 * function permettant la maj d'une sauce
 */
exports.modify = (req, res, next) => {
  const sauceObject = req.file

  /**
   * Si présence d'un fichier construction d'un objet qui contiendra le parse du body
   * ainsi que l'image irl du nouveau fichier sinon on récupère le body directement
   */
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      }
    : req.body;

  /**
   * recherche de la sauce par son id 
   */
  Sauce.findOne({ _id: req.params.id })
  /**
   * sauce contient soit un objet sauce soit rien
   */
    .then(sauce => {
      if (!validate(sauce, req, res)) return;
    /**
     * construction de la function de rappel 
     */
      const update = () => {
        Sauce.updateOne({ _id: req.params.id }, sauceObject)
          .then(() => res.status(200).json({ message: "Sauce modified" }))
          .catch(error => res.status(400).json({ error: "Bad Request" }));
      };

      /**
       * la function est effective si l'ancienne image est bien supprimé
       * ou si il n'y a pas de fichier
       */
      if (req.file) {
        const fileName = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${fileName}`, update);
      } else update();
    })
    .catch(error => res.status(500).json({ error: "Internal Server Error" }));
};

/**
 * function de suppression d'une sauce
 */
exports.delete = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if (!validate(sauce, req, res)) return;
      const fileName = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${fileName}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => {
            res.status(200).json({
              message: "Sauce deleted",
            });
          })
          .catch(error => {
            res.status(400).json({
              error: "Bad Request",
            });
          });
      });
    })
    .catch(error => res.status(500).json({ error: "Internal Server Error" }));
};

/**
 * Function de like dislike
 */
exports.like = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if (!sauce) {
        res.status(404).json({
          error: "No such Sauce",
        });
        return false;
      }
      let message;
      /**
       * en fonction de la valeur du like
       */
      switch (req.body.like) {
        //cas ajout d'un like
        case 1:
          addTo(sauce.usersLiked, req.body.userId);
          removeFrom(sauce.usersDisliked, req.body.userId);
          message = "Sauce Liked";
          break;
          //ajout d'un dislike
        case -1:
          addTo(sauce.usersDisliked, req.body.userId);
          removeFrom(sauce.usersLiked, req.body.userId);
          message = "Sauce Disliked";
          break;
          //retour status quo
        default:
          removeFrom(sauce.usersLiked, req.body.userId);
          removeFrom(sauce.usersLiked, req.body.userId);
          index = sauce.usersLiked.indexOf(req.body.userId);
          message = "Sauce Ignored";
          break;
      }
      /**
       * comptage like et dislikes par sauce
       */
      sauce.likes = sauce.usersLiked.length;
      sauce.dislikes = sauce.usersDisliked.length;
      sauce
        .updateOne({ _id: req.params.id }, sauce)
        .then(() => {
          res.status(200).json({ message });
        })
        .catch(error => res.status(400).json({ error: "Bad Request" }));
    })
    .catch(error => res.status(500).json({ error: "Internal Server Error" }));
};

/**
 * ajoute un userId à un tableau d'userId
 * @param {Array} array Tableau d'userId
 * @param {String} item L'userId à ajouter
 */
function addTo(array, item) {
  if (array.indexOf(item) === -1) {
    array.push(item);
  }
}

/**
 * retire une userId d'un tableau d'userId
 * @param {Array} array tableau userId
 * @param {String} item userId à supprimer
 */
function removeFrom(array, item) {
  const index = array.indexOf(item);
  if (index !== -1) {
    array.splice(index, 1);
  }
}

/**
 * retourne si la requête est valide ou non
 * @param {Sauce} sauce instance de sauce
 * @param {Object} req objet req d'express
 * @param {Object} res objet res d'express
 * @returns {Boolean} La validité de la reqête
 */
function validate(sauce, req, res) {
  if (!sauce) {
    res.status(404).json({
      error: "No such Sauce",
    });
    return false;
  }
  if (!req.auth || sauce.userId !== req.auth.userId) {
    res.status(403).json({
      error: "Unauthorized request",
    });
    return false;
  }
  return true;
}
