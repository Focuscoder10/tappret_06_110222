const env = require("../env");

module.exports = (req, res, next) => {
  if (env.origins.includes(req.headers.origin))
    res.set("Access-Control-Allow-Origin", req.headers.origin);
  res.set(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
};
