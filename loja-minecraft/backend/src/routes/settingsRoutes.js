const express = require("express");
const router = express.Router();
const settings = require("../controllers/settingsController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/", settings.getSettings);
router.put("/", authMiddleware, adminMiddleware, settings.updateSettings);

module.exports = router;
