import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ArticleDetails = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/article/${id}`
        );
        setArticle(response.data?.article);
      } catch (error) {
        console.error("Error fetching article:", error);
      }
    };

    fetchArticle();
  }, [id]);

  if (!article) return <p>Loading...</p>;

  return (
    <div className="p-8 bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">{article.Headline}</h1>
      <p className="text-sm text-gray-500 mb-6">
        {article.Author} - {article["Date published"]}
      </p>

      <p className="text-lg text-gray-700">{article["Article text"]}</p>
    </div>
  );
};

export default ArticleDetails;
