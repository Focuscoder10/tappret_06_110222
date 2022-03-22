/**
 * importation bibliothèques
 */
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const passwordValidator = require("password-validator");


const User = require("../models/User");

const env = require("../env");

const regexEmail =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;


const passValidator = new passwordValidator();

/**
 * https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
 * contraintes sur le mot de passe
 */
// prettier-ignore
passValidator
  .is().min(8)
  .is().max(64)
  .has().uppercase()
  .has().lowercase()
  .has().digits()
  .has().symbols();

/**
 * function enregistrement 
 */
exports.signup = (req, res, next) => {

  /**
   * condition si email non validé retourne erreur 400
   */
  if (!regexEmail.test(req.body.email))
    return res.status(400).json({ error: "Invalid Email Address" });

  /**
   * valide le mot de passe en affichant les détails.
   * retourne un tableau d'erreur sinon vide = true
   * tableau vide = mot de passe valide
   */
  const details = passValidator.validate(req.body.password, { details: true });
  if (details.length)
    return res.status(400).json({ error: `Invalid Password: ${details[0].message}` });

  /**
   * hash du mot de passe 
   */
  bcrypt
    .hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "User created" }))
        .catch(error => res.status(400).json({ error : "Bad Request" }));
    })
    .catch(error => res.status(500).json({ error: "Internal Server Error" }));
};

/**
 * function connection
 */
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: "Unauthorized" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, env.secret, { expiresIn: "24h" }),
          });
        })
        .catch(error => res.status(500).json({ error: "Internal Server Error" }));
    })
    .catch(error => res.status(500).json({ error: "Internal Server Error" }));
};
