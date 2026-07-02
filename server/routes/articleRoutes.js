const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    createArticle
);

router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    updateArticle
);

router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    deleteArticle
);

const {
    getAllArticles,
    createArticle,
    updateArticle,
    deleteArticle
} = require("../controllers/articleController");

router.delete("/:id", deleteArticle);

router.get("/", getAllArticles);

router.post("/", createArticle);
router.put("/:id", updateArticle);

module.exports = router;