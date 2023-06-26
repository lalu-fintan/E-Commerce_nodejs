const express = require("express");
const {
  createColor,
  updateColor,
  deletColor,
  getColor,
  getAllColor,
} = require("../controller/colorController");
const { verifyToken } = require("../middleware/verifyToken");
const { authMidddleware } = require("../middleware/verifyToken");

const router = express.Router();

router.get("/:id", getColor);
router.post("/", authMidddleware, verifyToken, createColor);
router.put("/:id", authMidddleware, verifyToken, updateColor);
router.get("/", getAllColor);
router.delete("/:id", authMidddleware, verifyToken, deletColor);

module.exports = router;
