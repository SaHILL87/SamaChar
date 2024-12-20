import axios from "axios";
import articles from "../models/article.models.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/mail.js";

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      msg: "Bad request. Please add email and password in the request body",
    });
  }
  let foundUser = await User.findOne({ email: req.body.email });
  if (foundUser) {
    const isMatch = await foundUser.comparePassword(password);
    if (isMatch) {
      const token = jwt.sign(
        { id: foundUser._id, name: foundUser.name },
        process.env.JWT_SECRET,
        {
          expiresIn: "30d",
        }
      );

      return res.status(200).json({ msg: "User logged in", token });
    } else {
      return res.status(400).json({ msg: "Bad password" });
    }
  } else {
    return res.status(400).json({ msg: "Bad credentials" });
  }
};

const dashboard = async (req, res) => {
  const luckyNumber = Math.floor(Math.random() * 100);

  res.status(200).json({
    msg: `Hello, ${req.user.name}`,
    secret: `Here is your authorized data, your lucky number is ${luckyNumber}`,
  });
};

const getAllUsers = async (req, res) => {
  let users = await User.find({});
  return res.status(200).json({ users });
};

const register = async (req, res) => {
  let foundUser = await User.findOne({ email: req.body.email });

  if (foundUser === null) {
    let { username, email, password, categories } = req.body;

    if (username.length && email.length && password.length) {
      const person = new User({
        name: username,
        email: email,
        password: password,
        categories: categories, // Save selected categories
      });

      await person.save();

      // Send welcome email
      const emailSubject = "Welcome to Our Community! 🎉";
      const emailMessage = `
Hi ${username},

Welcome to SamaChar! 🎉 We’re thrilled to have you with us and can’t wait for you to explore everything we have to offer.

At SamaChar, we’re committed to making your experience unforgettable.

Once again, thank you for joining us—we’re excited to have you on board!

Warm regards,  
The Samachar Team
`;

      try {
        await sendEmail(email, emailSubject, emailMessage);
      } catch (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({
          msg: "Registration successful, but failed to send welcome email.",
        });
      }

      return res.status(201).json({ person });
    } else {
      return res
        .status(400)
        .json({ msg: "Please add all values in the request body" });
    }
  } else {
    return res.status(400).json({ msg: "Email already in use" });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Update User Profile
const updateProfile = async (req, res, next) => {
  const { name, email, categories } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the fields if they are provided in the request body
    if (name) user.name = name;
    if (email) user.email = email;
    if (categories) user.categories = categories;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        categories: user.categories,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile" });
  }
};

const getRecommendedArticles = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const watchedArticles = user?.watchedArticles
      .slice(-5)
      .map((id) => String(id));
    const pythonResponse = await axios.post(`http://127.0.0.1:5001/recommend`, {
      object_ids: watchedArticles,
    });
    const recommendedArticleMap = pythonResponse.data;

    // Collect all unique recommended article IDs
    const recommendedIds = Object.values(recommendedArticleMap).flat();

    if (recommendedIds.length === 0) {
      return res.status(200).json({ recommendedArticles: [] });
    }

    // Fetch the actual articles from your MongoDB using the recommended IDs
    const recommendedArticles = await articles.find({
      _id: { $in: recommendedIds },
    });

    res.status(200).json({ recommendedArticles });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching recommended articles" });
  }
};

export {
  login,
  dashboard,
  getAllUsers,
  register,
  getProfile,
  updateProfile,
  getRecommendedArticles,
};
