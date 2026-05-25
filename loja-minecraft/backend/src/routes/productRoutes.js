const express = require("express");
const router = express.Router();
const product = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/", product.listProducts);
router.post("/", authMiddleware, adminMiddleware, product.createProduct);
router.delete("/:id", authMiddleware, adminMiddleware, product.deleteProduct);

module.exports = router;
