import express from "express";
import articles from "../models/article.models.js";
import authMiddleware from "../middleware/auth.js";
import User from "../models/User.js";
const router = express.Router();
// Fetch all articles
// router.get("/articles", authMiddleware, async (req, res) => {
//   try {
//     const articleList = await articles.find({}).limit(10);

//     res.status(200).json({ articleList });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

router.get("/articles", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Assuming auth middleware sets this

    // Fetch the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure categories is an array, even if it's empty
    const categories = user.categories || [];
    const randomCategories = Math.random() * categories.length;
    const finalCategory = categories[Math.floor(randomCategories)];

    if (categories.length === 0) {
      // If user has no selected categories, return an empty list
      return res
        .status(200)
        .json({ articleList: [] }, "No categories selected");
    }

    // Find articles that match the user's selected categories
    const articleList = await articles.aggregate([
      { $match: { Category: { $in: user.categories } } }, // Match documents containing the specific tag
      { $sample: { size: 20 } }, // Randomly select 'numberOfDocuments'
    ]);

    res.status(200).json({ articleList });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch a specific article by ID
router.get("/article/:id", authMiddleware, async (req, res) => {
  try {
    // Find the article by ID
    const article = await articles.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ msg: "Article not found" });
    }

    // Get the user from the request (assuming authMiddleware adds user info to the request)
    const userId = req.user.id;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the article is liked by the user (article ID exists in user's likedArticles array)
    const liked = user.likedArticles.includes(article._id.toString()); // Ensure proper type comparison

    // Send the article along with the "liked" status
    res.status(200).json({ article: { ...article._doc, liked } });
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
    const categoryResults = await articles
      .find({ Category: category })
      .limit(10);

    res.status(200).json({ articleList: categoryResults });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/like-article", authMiddleware, async (req, res) => {
  try {
    const { articleId } = req.body;

    if (!articleId) {
      return res.status(400).json({ message: "Article ID is required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.likedArticles.includes(articleId)) {
      user.likedArticles.push(articleId);
      await user.save();
    }
    res.status(200).json({ message: "Article liked successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error Liking Article" });
  }
});

router.get("/liked-articles", authMiddleware, async (req, res) => {
  const userId = req.user.id; // Assuming you are using authentication middleware

  try {
    const user = await User.findById(userId).populate("likedArticles"); // Assuming you are storing liked articles as ObjectIds

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const likedArticles = user.likedArticles;

    res.status(200).json({ likedArticles });
  } catch (error) {
    res.status(500).json({ message: "Error fetching liked articles" });
  }
});

export default router;
