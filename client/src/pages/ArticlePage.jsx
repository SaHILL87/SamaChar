import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons"; // Unliked state

const ArticleDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("auth")) || ""
  );
  const [summary, setSummary] = useState(null); // State to hold summary
  const [sentiment, setSentiment] = useState(null); // State to hold sentiment
  const [liked, setLiked] = useState(false); // To track whether article is liked
  const [translatedtext, SetTranslatedText] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      let axiosConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/article/${id}`,
          axiosConfig
        );
        setArticle(response.data?.article);

        if (response.data?.article?.liked !== undefined) {
          setLiked(response.data.article.liked);
        }
      } catch (error) {
        console.error("Error fetching article:", error);
        toast.error("Failed to fetch article details.");
      }
    };

    fetchArticle();
  }, [id, token]);

  useEffect(() => {
    const updateWatchingHistory = async () => {
      try {
        const axiosConfig = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.post(
          `http://localhost:5000/api/v1/watched-article`,
          {
            articleId: id,
          },
          axiosConfig
        );
        console.log(response.data);
      } catch (error) {
        console.error("Error updating watching history:", error);
        toast.error("Failed to update watching history.");
      }
    };
    updateWatchingHistory();
  }, [id, token]);

  useEffect(() => {
    if (token === "") {
      navigate("/login");
      toast.warn("Please login first to access dashboard");
    }
  }, [token, navigate]);

  // Function to handle article summarization
  const handleSummarization = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:5001/summarize_and_sentiment", // Replace with your Python API endpoint
        { text: article["Article text"] }
      );
      setSummary(response.data.summary);
      setSentiment(response.data.sentiment);
      console.log(response.data); // Assuming your Python API returns the summary here
    } catch (error) {
      console.error("Error summarizing article:", error);
      toast.error("Failed to summarize article.");
    }
  };

  // Function to handle sentiment analysis
  const handleSentimentAnalysis = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:5001/translate_to_hindi", // Replace with your Python API endpoint
        { text: article["Article text"] }
      );
      SetTranslatedText(response.data.hindi_translation); // Assuming your Python API returns the sentiment here
    } catch (error) {
      console.error("Error translating:", error);
      toast.error("Failed to Translate to Hindi.");
    }
  };

  // Function to handle liking an article
  const handleLikeArticle = async () => {
    try {
      const axiosConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        "http://localhost:5000/api/v1/like-article",
        { articleId: id },
        axiosConfig
      );

      setLiked(true); // Update liked state to true
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error liking article:", error);
      toast.error("Failed to like article.");
    }
  };

  // Function to handle unliking an article
  const handleUnlikeArticle = async () => {
    try {
      const axiosConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        "http://localhost:5000/api/v1/unlike-article",
        { articleId: id },
        axiosConfig
      );

      setLiked(false); // Update liked state to false
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error unliking article:", error);
      toast.error("Failed to unlike article.");
    }
  };

  if (!article) return <p className="text-center mt-10 text-lg">Loading...</p>;

  return (
    <div className="bg-[#fdfdfd]">
      <Navbar />
      <div className="w-[80%] mx-auto p-8 bg-[#e5eef8]">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold mb-4 text-[#1E3A8A]">
            {article.Headline}
          </h1>
          <div className="flex space-x-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
              onClick={handleSummarization}
            >
              Summarize
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
              onClick={handleSentimentAnalysis}
            >
              Translate to Hindi
            </button>

            {/* Like/Unlike (Heart Icon) */}
            <button
              className="focus:outline-none"
              onClick={liked ? handleUnlikeArticle : handleLikeArticle}
            >
              <FontAwesomeIcon
                icon={liked ? solidHeart : regularHeart}
                className={`text-3xl transition duration-200 ${
                  liked ? "text-red-500" : "text-gray-400"
                }`}
              />
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          {article.Author} -{" "}
          {new Date(article["Date published"]).toLocaleDateString()}
        </p>
        <div className="prose lg:prose-xl text-gray-700 m-3">
          {translatedtext ? (
            <p>
              <strong>Translation:</strong> {translatedtext}
            </p>
          ) : (
            <p>{article["Article text"]}</p>
          )}
        </div>

        <div className="prose lg:prose-xl text-gray-700 m-3">
          {summary ? (
            <p>
              <strong>Summary:</strong> {summary}
            </p>
          ) : (
            <p>{article["Article text"]}</p>
          )}
        </div>

        {sentiment && (
          <div className="mt-4">
            <p className="text-lg">
              <strong>Sentiment:</strong> {sentiment}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleDetails;
