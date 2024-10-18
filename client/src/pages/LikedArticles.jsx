import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

const LikedArticles = () => {
  const [likedArticles, setLikedArticles] = useState([]);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("auth")) || ""
  );
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLikedArticles = async () => {
      let axiosConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/liked-articles",
          axiosConfig
        );
        setLikedArticles(response.data?.likedArticles);
      } catch (error) {
        console.error("Error fetching liked articles:", error);
        setError("Error fetching liked articles.");
      }
    };

    fetchLikedArticles();
  }, [token]);

  useEffect(() => {
    if (token === "") {
      navigate("/login");
      toast.warn("Please login first to access liked articles");
    }
  }, [token]);

  return (
    <>
      <Navbar />
      <div className="p-4 sm:p-8 bg-[#F3F4F6] min-h-screen">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-[#1E3A8A]">
          Liked Articles
        </h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {likedArticles?.map((article) => (
            <Link to={`/article/${article._id}`} key={article._id}>
              <div className="bg-white p-6 h-[17rem] rounded-lg shadow-md hover:shadow-lg hover:border-[#1E3A8A] border border-transparent transition-all duration-300 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold mb-2 text-[#1E3A8A]">
                    {article.Headline}
                  </h2>
                  <p className="text-gray-600">
                    {article.Description.length > 100
                      ? `${article.Description.substring(0, 200)}...`
                      : article.Description}
                  </p>
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

export default LikedArticles;
