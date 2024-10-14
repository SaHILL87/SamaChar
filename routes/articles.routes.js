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

router.get("/articles/search", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Search query is required" });
  }

  try {
    const searchResults = await articles
      .find({
        $or: [
          { Headline: { $regex: query, $options: "i" } }, // Case-insensitive search in Headline
          { Description: { $regex: query, $options: "i" } }, // Case-insensitive search in Description
          { Keywords: { $regex: query, $options: "i" } }, // Case-insensitive search in Keywords
        ],
      })
      .select("_id Headline Description");

    res.status(200).json({ articles: searchResults });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/articles/category", async (req, res) => {
  const { category } = req.query;

  if (!category) {
    return res.status(400).json({ error: "Category is required" });
  }

  try {
    const categoryResults = await articles.find({ Category: category });

    res.status(200).json({ articles: categoryResults });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
