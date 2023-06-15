const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const token = req.headers.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_TOKEN);

      if (decoded.role === "admin") {
        next();
      } else {
        throw new Error("you dont have access");
      }
    } catch (error) {
      throw new Error("You are not autherized person,you're token expired");
    }
  }
  // else {
  //   res.status(402).json({ message: "you don't have  token" });
  // }
};

const authMidddleware = async (req, res, next) => {
  const token = req.headers.token;

  if (token) {
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
    req.user = decoded;

    next();
  } else {
    res.status(402).json({ message: "you don't have  token" });
  }
};

module.exports = { verifyToken, authMidddleware };
