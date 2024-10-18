import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

const Articles = () => {
  const [articleList, setArticleList] = useState([]);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("auth")) || ""
  );
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category");

  useEffect(() => {
    const fetchArticles = async () => {
      let axiosConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        let url = "http://localhost:5000/api/v1/articles";

        if (category) {
          url = `http://localhost:5000/api/v1/articles/category?category=${category}`;
        }

        const response = await axios.get(url, axiosConfig);
        setArticleList(response.data?.articleList);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setError("Error fetching articles.");
      }
    };

    fetchArticles();
  }, [category, token]);

  useEffect(() => {
    if (token === "") {
      navigate("/login");
      toast.warn("Please login first to access dashboard");
    }
  }, [token]);

  return (
    <>
      <Navbar />
      <div className="p-4 sm:p-8 bg-[#F3F4F6] min-h-screen">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-[#1E3A8A]">
          {category ? `News in ${category}` : "Latest News"}
        </h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {articleList?.map((article) => (
            <Link to={`/article/${article._id}`} key={article._id}>
              <div className="bg-white p-6 h-[17rem] rounded-lg shadow-md hover:shadow-lg hover:border-[#1E3A8A] border border-transparent transition-all duration-300 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold mb-2 text-[#1E3A8A]">
                    {article.Headline}
                  </h2>
                  <p className="text-gray-600">{article.Description}</p>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    {article.Author} -{" "}
                    {new Date(article["Date published"]).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Articles;
