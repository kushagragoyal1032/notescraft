const jwt = require("jsonwebtoken");
const JWT_SECRET = "kkgoyal";

const fetchuser = (req, res, next) => {
  // get users for JWT token and add id to req object
  const token = req.header("auth.token");
  if (!token) {
    res.status(401).send({ errors: "Please authenicate using valid token" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    console.log(error.message);
    res.status(401).send({ errors: "Please authenicate using valid token" });
  }
};

module.exports = fetchuser;
