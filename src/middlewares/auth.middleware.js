const jwt = require("jsonwebtoken");
const jwtConfig = require("./config/jwt");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).authorization();
  }

  const token = jwt.authHeader;
};
