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
} = require("../controller/userController");
const verifyToken = require("../controller/verifyToken");

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/", getAllUser);
router.get("/:id", userGetById);
router.put("/:id", verifyToken, userUpdateById);
router.delete("/:id", verifyToken, userDeleteById);
router.put("/block/:id", verifyToken, blockUser);
router.put("/unblock/:id", verifyToken, unBlockUser);

module.exports = router;
