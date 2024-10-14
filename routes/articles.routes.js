import express from "express";
import articles from "../models/article.models.js";
const router = express.Router();

// Fetch all articles
router.get("/articles", async (req, res) => {
  try {
    const articleList = await articles.find({}).limit(10);

    res.status(200).json({ articleList });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch a specific article by ID
router.get("/article/:id", async (req, res) => {
  try {
    const article = await articles.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ msg: "Article not found" });
    }
    res.status(200).json({ article });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
