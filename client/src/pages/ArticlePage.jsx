import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

const ArticleDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("auth")) || ""
  );

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
      } catch (error) {
        console.error("Error fetching article:", error);
        toast.error("Failed to fetch article details.");
      }
    };

    fetchArticle();
  }, [id, token]);

  useEffect(() => {
    if (token === "") {
      navigate("/login");
      toast.warn("Please login first to access dashboard");
    }
  }, [token, navigate]);

  if (!article) return <p className="text-center mt-10 text-lg">Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="w-[80%] mx-auto p-8 bg-gray-100">
        <h1 className="text-4xl font-bold mb-4 text-[#1E3A8A]">
          {article.Headline}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          {article.Author} -{" "}
          {new Date(article["Date published"]).toLocaleDateString()}
        </p>

        <div className="prose lg:prose-xl text-gray-700">
          <p>{article["Article text"]}</p>
        </div>
      </div>
    </>
  );
};

export default ArticleDetails;
