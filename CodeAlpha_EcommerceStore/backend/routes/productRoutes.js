const router = require("express").Router();
const Product = require("../models/Product");

router.get("/", async (req, res, next) => {
  try {
    const search = String(req.query.search || "").trim();
    const filter = search ? { $or: [
      { name: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } }
    ] } : {};
    res.json(await Product.find(filter).sort({ createdAt: -1 }));
  } catch (err) { next(err); }
});

router.get("/:id", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found." });
    res.json(product);
  } catch (err) { next(err); }
});

module.exports = router;
