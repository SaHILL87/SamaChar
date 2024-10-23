import { useState } from 'react';
import { Calendar, Share2, Clock } from 'lucide-react';

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const NewsCard = ({ article }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
    <h2 className="text-xl font-bold mb-3 text-gray-800">{article.title}</h2>
    <div className="flex items-center gap-2 mb-3 text-gray-600">
      <Clock size={16} />
      <span className="text-sm">
        Scraped: {formatDate(article.scraped_at)}
      </span>
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
  const [data] = useState({
    "metadata": {
      "location": {
        "state": "Maharashtra",
        "country": "India"
      },
      "total_articles": 3,
      "timestamp": "20241023_230431"
    },
    "articles": [
      {
        "title": "Coldplay tickets for 11,000? Uproar in India after tickets sold out in minutes and resold for outrageously high prices By Esha Mitra, Alex Stambaugh and Teele Rebane, CNN 3 minute read Published 1247 AM EDT, Tue October 1, 2024",
        "content": "New Delhi CNN  Fans eagerly awaiting the return of Coldplay to India were shocked to find tickets being resold online for as much as 11,000...",
        "url": "https://edition.cnn.com/2024/10/01/asia/coldplay-concert-ticket-india-scalping-intl-hnk/index.html",
        "scraped_at": "2024-10-23 23:04:20"
      },
      {
        "title": "Prime minister Modis blessing and a Kardashian cameo  heres what happened at Indias wedding of the year By Rhea Mogul, CNN 5 minute read Updated 1128 PM EDT, Mon July 15, 2024",
        "content": "CNN  Indias most anticipated wedding of the year came to an end on Sunday after a star-studded three-day celebration...",
        "url": "https://edition.cnn.com/2024/07/15/style/ambani-wedding-mumbai-modi-kardashian/index.html",
        "scraped_at": "2024-10-23 23:04:23"
      },
      {
        "title": "Justin Bieber to Mughal jewels Ambani wedding transfixes India By Diksha Madhok, CNN 6 minute read Updated 256 AM EDT, Tue July 9, 2024",
        "content": "New Delhi CNN  The wedding of the year is here. In less than a week, Anant Ambani, son of Indian billionaire Mukesh Ambani...",
        "url": "https://edition.cnn.com/2024/07/05/business/ultra-rich-indian-weddings-economy-intl-hnk/index.html",
        "scraped_at": "2024-10-23 23:04:27"
      }
    ]
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">News Dashboard</h1>
          <div className="flex items-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar size={20} />
              <span>
                Last Updated: {formatDate(data.metadata.timestamp)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {data.metadata.location.state}, {data.metadata.location.country}
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