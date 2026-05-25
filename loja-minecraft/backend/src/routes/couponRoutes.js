const express = require("express");
const router = express.Router();
const coupon = require("../controllers/couponController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/", authMiddleware, adminMiddleware, coupon.listCoupons);
router.post("/", authMiddleware, adminMiddleware, coupon.createCoupon);

module.exports = router;
