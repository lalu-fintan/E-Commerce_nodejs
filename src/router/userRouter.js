const express = require("express");
const {
  register,
  login,
  getAllUser,
  userGetById,
  userUpdateById,
  userDeleteById,
  blockUser,
  unBlockUser,
  handleRefreshToken,
  logOut,
} = require("../controller/userController");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/refreshtoken", handleRefreshToken);
router.get("/logout", logOut);
router.get("/", getAllUser);
router.get("/:id", userGetById);
router.put("/:id", verifyToken, userUpdateById);
router.delete("/:id", verifyToken, userDeleteById);
router.put("/block/:id", verifyToken, blockUser);
router.put("/unblock/:id", verifyToken, unBlockUser);

module.exports = router;
