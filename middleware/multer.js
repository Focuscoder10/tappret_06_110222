const multer = require("multer");
const slugify = require("slugify");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

/**
 * paramètrages du multer avec assignation du dossier de destination
 * ainsi que le nom du fichier
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    const name = slugify(file.originalname, { lower: true });
    const ext = MIME_TYPES[file.mimetype];
    cb(null, `${name}-${Date.now()}.${ext}`);
  },
});

module.exports = multer({ storage }).single("image");
