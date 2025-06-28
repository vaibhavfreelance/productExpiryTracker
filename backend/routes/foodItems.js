// backend/routes/foodItems.js
const express = require("express");
const router = express.Router();
const {
  getItems,
  addItem,
  updateItem,
  deleteItem,
} = require("../controllers/foodItemController");

const auth = require("../middleware/authMiddleware");

// ✅ Protected Routes
router.get("/", auth, getItems);
router.post("/", auth, addItem);
router.put("/:id", auth, updateItem);
router.delete("/:id", auth, deleteItem);

module.exports = router;
