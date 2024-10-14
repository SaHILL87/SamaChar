import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const Articles = () => {
  const [articleList, setArticleList] = useState([]);
  const [error, setError] = useState(null); // To track errors

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/articles"
        );
        console.log(response.data?.articleList);
        setArticleList(response.data?.articleList);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setError("Error fetching articles.");
      }
    };

    fetchArticles();
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-8 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Latest News</h1>
        {error && <p className="text-red-500">{error}</p>}{" "}
        {/* Display error message */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {articleList.map((article) => (
            <Link to={`/article/${article._id}`} key={article._id}>
              <div className="bg-gray-200 p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 h-[15rem]">
                <h2 className="text-xl font-bold mb-2">{article.Headline}</h2>
                <p className="text-gray-600">{article.Description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {article.Author} - {article["Date published"]}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Articles;
