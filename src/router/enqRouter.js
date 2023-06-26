const express = require("express");
const {
  createEnquiry,
  updateEnquiry,
  deletEnquiry,
  getEnquiry,
  getAllEnquiry,
} = require("../controller/enqController");
const { verifyToken } = require("../middleware/verifyToken");
const { authMidddleware } = require("../middleware/verifyToken");

const router = express.Router();

router.get("/:id", getEnquiry);
router.post("/", authMidddleware, createEnquiry);
router.put("/:id", authMidddleware, verifyToken, updateEnquiry);
router.get("/", getAllEnquiry);
router.delete("/:id", authMidddleware, verifyToken, deletEnquiry);

module.exports = router;
