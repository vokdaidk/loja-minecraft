const express = require("express");
const router = express.Router();
const admin = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/dashboard", authMiddleware, adminMiddleware, admin.dashboard);

module.exports = router;
