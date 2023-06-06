const jwt = require("jsonwebtoken");

const genreateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_TOKEN, { expiresIn: "3d" });
};

module.exports = genreateRefreshToken;
