const express = require("express");
const router = express.Router();
const order = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/my", authMiddleware, order.myOrders);
router.post("/", authMiddleware, order.createOrder);

module.exports = router;
