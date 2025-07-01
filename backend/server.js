// server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// DB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB error:", err));

// Routes
const foodRoutes = require("./routes/foodItems");
app.use("/api/items", foodRoutes);
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
app.use(
  cors({
    origin: ["https://product-expiry-tracker.vercel.app"], // ✅ Replace with real frontend
    credentials: true,
  })
);
// Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.listen(5000, "0.0.0.0/0", () => {
  console.log("Server running at 5000");
});
