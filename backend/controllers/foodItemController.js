// backend/controllers/foodItemController.js
const FoodItem = require("../models/FoodItem");

// ✅ GET all items for current user
exports.getItems = async (req, res) => {
  try {
    const items = await FoodItem.find({ user: req.user.id }).sort({
      expiryDate: 1,
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ POST add item for current user
exports.addItem = async (req, res) => {
  const { name, category, expiryType, expiryDate } = req.body;
  try {
    const item = new FoodItem({
      name,
      category,
      expiryType,
      expiryDate,
      user: req.user.id, // ✅ assign user from token
    });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ PUT update item
exports.updateItem = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await FoodItem.findOneAndUpdate(
      { _id: id, user: req.user.id },
      req.body,
      { new: true }
    );
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ DELETE item
exports.deleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    await FoodItem.findOneAndDelete({ _id: id, user: req.user.id });
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
