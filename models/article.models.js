import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema({
  Index: {
    type: Number,
    required: true,
  },
  Author: {
    type: String,
    required: true,
  },
  DatePublished: {
    type: String,
    required: true,
  },
  Category: {
    type: String,
    required: true,
  },
  Section: {
    type: String,
    required: true,
  },
  Url: {
    type: String,
    required: true,
  },
  Headline: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  Keywords: {
    type: String,
    required: true,
  },
  SecondHeadline: {
    type: String,
    required: true,
  },
});

const articles =
  mongoose.models.articles || mongoose.model("articles", ArticleSchema);

export default articles;
