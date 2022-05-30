
const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
    try {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
    console.log("token Auth",token);
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
    const decoded = jwt.verify(token, "TOKEN_KEY_SECRET_HERE");
    console.log(decoded);
    req.user = decoded;
  } catch (err) {
      console.log(err)
    return res.status(401).send({e:err.toString()});
  }
  return next();
};

module.exports = verifyToken;