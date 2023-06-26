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
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  adminLogin,
  getWishList,
  saveAddress,
  userCart,
  getUserCart,
  emptycart,
  applyCoupon,
  createOrder,
  getOrders,
  updateOrderStatus,
} = require("../controller/userController");
const { verifyToken, authMidddleware } = require("../middleware/verifyToken");

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/admin-login", adminLogin);

router.post("/user-cart", authMidddleware, userCart);
router.post("/cart/applycoupon", authMidddleware, applyCoupon);
router.post("/cart/cash-order", authMidddleware, createOrder);
router.put("/password/:id", updatePassword);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);
router.put(
  "/order/update-order/:id",
  authMidddleware,
  verifyToken,
  updateOrderStatus
);

router.get("/user-cart", authMidddleware, getUserCart);
router.delete("/remove-cart", authMidddleware, emptycart);
router.get("/get-orders", authMidddleware, getOrders);
router.get("/refreshtoken", handleRefreshToken);
router.get("/logout", logOut);
router.get("/wishlist", authMidddleware, getWishList);
router.put("/address", authMidddleware, saveAddress);

router.get("/", getAllUser);
router.get("/:id", userGetById);
router.put("/:id", verifyToken, userUpdateById);
router.delete("/:id", verifyToken, userDeleteById);
router.put("/block/:id", verifyToken, blockUser);
router.put("/unblock/:id", verifyToken, unBlockUser);

module.exports = router;
