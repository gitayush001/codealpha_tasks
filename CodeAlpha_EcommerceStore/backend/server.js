require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Product = require("./models/Product");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

async function seedProducts() {
  if (await Product.countDocuments()) return;
  await Product.insertMany([
    { name: "Everyday Backpack", description: "A durable backpack for work, college, and travel.", price: 1299, category: "Accessories", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800", stock: 20 },
    { name: "Classic Wristwatch", description: "A minimal everyday watch with a comfortable strap.", price: 1899, category: "Accessories", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800", stock: 15 },
    { name: "Wireless Headphones", description: "Comfortable over-ear headphones for music and calls.", price: 2499, category: "Electronics", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800", stock: 12 },
    { name: "Ceramic Coffee Mug", description: "A simple ceramic mug for your daily coffee or tea.", price: 399, category: "Home", image: "https://images.unsplash.com/photo-1514228742587-6b1558f2833d?w=800", stock: 30 }
  ]);
}

const port = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/codealpha_ecommerce")
  .then(async () => {
    await seedProducts();
    app.listen(port, () => console.log(`ShopEase running at http://localhost:${port}`));
  })
  .catch(err => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
