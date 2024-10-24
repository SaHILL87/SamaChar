import { useEffect, useState } from "react";
import { Calendar, Share2, Clock } from "lucide-react";

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const NewsCard = ({ article }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
    <h2 className="text-xl font-bold mb-3 text-gray-800">{article.title}</h2>
    <div className="flex items-center gap-2 mb-3 text-gray-600">
      <Clock size={16} />
      <span className="text-sm">Scraped: {formatDate(article.scraped_at)}</span>
    </div>
    <p className="text-gray-600 mb-4 line-clamp-3">
      {article.content.slice(0, 200)}...
    </p>
    <div className="flex justify-between items-center">
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 font-medium"
      >
        Read More
      </a>
      <Share2
        size={20}
        className="text-gray-500 hover:text-gray-700 cursor-pointer"
        onClick={() => navigator.clipboard.writeText(article.url)}
      />
    </div>
  </div>
);

export default function NewsDashboard() {
  const [data, setData] = useState({ articles: [] });

  useEffect(() => {
    // Fetch the JSON file
    fetch("/cnn_articles_maharashtra_20241023_230431.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            News Dashboard
          </h1>
          <div className="flex items-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar size={20} />
              <span>Last Updated: {formatDate(data.metadata?.timestamp)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {data.metadata?.location.state},{" "}
                {data.metadata?.location.country}
              </span>
            </div>
          </div>
        </div>

        {/* Articles */}
        <div>
          {data.articles.map((article, index) => (
            <NewsCard key={index} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
}
