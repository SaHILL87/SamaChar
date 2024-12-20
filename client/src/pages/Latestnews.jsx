import { useEffect, useState } from "react";
import { Calendar, Share2, Clock, Loader2 } from "lucide-react";

// Format date helper function
const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// NewsCard component
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
      <Share2 size={20} className="text-gray-500 hover:text-gray-700" />
    </div>
  </div>
);

const App = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("http://localhost:5001/scrape-articles");
        if (response.ok) {
          const data = await response.json();
          setArticles(data);
        } else {
          setError("Failed to fetch articles");
        }
      } catch (error) {
        setError("Error fetching articles: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Scraped Articles</h1>

      {/* Info Alert */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <p className="text-blue-700">
          Please note: The scraping process may take up to 5 minutes to
          complete. Thank you for your patience.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-gray-600">Scraping articles, please wait...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      ) : articles.length > 0 ? (
        <div>
          {articles.map((article, index) => (
            <NewsCard key={index} article={article} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No articles available</p>
      )}
    </div>
  );
};

export default App;
