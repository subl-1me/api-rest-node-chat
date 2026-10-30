const { verifyToken } = require("../helpers/jwt");
const moment = require("moment");

const authenticate = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).send("Unauthorized");

  try {
    const decodedToken = verifyToken(authorization);
    let now = moment().unix();
    if (now > decodedToken.exo) {
      // is expired?
      return res.status(401).send("Expired token");
    }

    req.authentication = decodedToken;
    next();
  } catch (err) {
    return res.status(401).send("Invalid token.");
  }
};

module.exports = authenticate;
