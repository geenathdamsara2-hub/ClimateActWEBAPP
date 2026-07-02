const express = require("express");

const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get(
    "/",
    authMiddleware,
    adminMiddleware,
    getDashboardStats
);
const {
    getDashboardStats
} = require("../controllers/dashboardController");

router.get("/", getDashboardStats);

module.exports = router;