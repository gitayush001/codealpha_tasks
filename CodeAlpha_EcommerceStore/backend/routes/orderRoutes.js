const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const Order = require("../models/Order");
const Product = require("../models/Product");

router.post("/", auth, async (req, res, next) => {
  try {
    const requested = req.body.items;
    if (!Array.isArray(requested) || !requested.length)
      return res.status(400).json({ message: "Your cart is empty." });

    const items = [];
    let total = 0;
    for (const row of requested) {
      const quantity = Number(row.quantity);
      if (!Number.isInteger(quantity) || quantity < 1)
        return res.status(400).json({ message: "Invalid item quantity." });
      const product = await Product.findById(row.productId);
      if (!product) return res.status(400).json({ message: "A product in your cart no longer exists." });
      if (product.stock < quantity)
        return res.status(400).json({ message: `Not enough stock for ${product.name}.` });
      items.push({ product: product._id, name: product.name, price: product.price, quantity });
      total += product.price * quantity;
    }

    for (const item of items) {
      await Product.updateOne({ _id: item.product }, { $inc: { stock: -item.quantity } });
    }
    const order = await Order.create({ user: req.user._id, items, total });
    res.status(201).json({ message: "Order placed successfully.", order });
  } catch (err) { next(err); }
});

router.get("/my-orders", auth, async (req, res, next) => {
  try {
    res.json(await Order.find({ user: req.user._id }).sort({ createdAt: -1 }));
  } catch (err) { next(err); }
});

module.exports = router;
