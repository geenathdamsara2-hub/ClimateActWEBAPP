const express = require("express");
const router = express.Router();

const {
  getAllArticles,
  createArticle,
  updateArticle,
  deleteArticle
} = require("../controllers/articleController");

// GET all
router.get("/", getAllArticles);

// CREATE
router.post("/", createArticle);

// UPDATE
router.put("/:id", updateArticle);

// DELETE
router.delete("/:id", deleteArticle);

module.exports = router;