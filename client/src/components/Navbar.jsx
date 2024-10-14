"use client";

import React, { useState } from "react";
import { Search, Filter, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [categoryResults, setCategoryResults] = useState([]);
  const navigate = useNavigate();

  const handleSearchChange = async (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length > 2) {
      // Fetch search results from backend
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/articles/search?query=${e.target.value}`
        );
        setSearchResults(response.data.articles);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleFilterToggle = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleResultClick = (articleId) => {
    navigate(`/article/${articleId}`);
  };

  const handleFilterApply = async () => {
    console.log(category);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/v1/articles/category?category=${category}`
      );
      setCategoryResults(response.data.articles);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <nav className="bg-primary text-primary-foreground p-4 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        <div className="text-2xl font-bold">Samachar</div>

        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full md:w-64 py-2 px-4 rounded-full bg-primary-foreground text-primary focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            <Search
              className="absolute right-3 top-2.5 text-primary"
              size={20}
            />

            {/* Dropdown for search results */}
            {searchResults.length > 0 && (
              <ul className="absolute bg-white border border-gray-300 w-full mt-1 rounded-lg z-50 shadow-lg max-h-48 overflow-y-auto">
                {searchResults.map((result) => (
                  <li
                    key={result._id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleResultClick(result._id)}
                  >
                    {result.Headline}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleFilterToggle}
              className="hover:bg-secondary hover:text-secondary-foreground p-2 rounded-full transition duration-300"
            >
              <Filter size={24} />
            </button>
            <Link to="/profile">
              <button className="hover:bg-secondary hover:text-secondary-foreground p-2 rounded-full transition duration-300">
                <User size={24} />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {isFilterOpen && (
        <div className="container mx-auto mt-4 p-4 bg-white text-primary rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Filters</h3>
          <div className="flex flex-wrap gap-4">
            <select
              className="p-2 border rounded bg-background text-foreground"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Category</option>
              <option value="news">News</option>
              <option value="business">Business</option>
              <option value="health">Health</option>
            </select>

            <button
              onClick={handleFilterApply}
              className="bg-secondary text-secondary-foreground p-2 rounded-lg shadow hover:shadow-lg transition duration-300"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
