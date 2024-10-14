import express from "express";
import authMiddleware from "../middleware/auth.js";
const router = express.Router();

import {
  login,
  register,
  dashboard,
  getAllUsers,
} from "../controllers/user.js";
router.route("/login").post(login);
router.route("/register").post(register);
router.route("/dashboard").get(authMiddleware, dashboard);
router.route("/users").get(getAllUsers);

export default router;
