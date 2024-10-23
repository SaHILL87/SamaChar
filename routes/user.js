import express from "express";
import authMiddleware from "../middleware/auth.js";
const router = express.Router();

import {
  login,
  register,
  dashboard,
  getAllUsers,
  getProfile,
  updateProfile,
  getRecommendedArticles,
} from "../controllers/user.js";
router.route("/login").post(login);
router.route("/register").post(register);
router.route("/dashboard").get(authMiddleware, dashboard);
router.route("/users").get(getAllUsers);
router.route("/profile").get(authMiddleware, getProfile);
router.route("/profile/update").put(authMiddleware, updateProfile);
router
  .route("/recommended-articles")
  .post(authMiddleware, getRecommendedArticles);

export default router;
