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
  const navigate = useNavigate();

  const handleSearchChange = async (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length > 2) {
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

  const handleFilterApply = () => {
    navigate(`/articles?category=${category}`);
  };

  return (
    <nav className="bg-[#1E3A8A] text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        <div className="text-2xl font-bold">Samachar</div>

        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full md:w-64 py-2 px-4 rounded-full bg-[#F3F4F6] text-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#10B981] transition duration-300"
            />

            <Search
              className="absolute right-3 top-2.5 text-[#1E3A8A]"
              size={20}
            />
            {searchResults.length > 0 && (
              <ul className="absolute bg-white border border-gray-300 w-full mt-1 rounded-lg z-50 shadow-lg max-h-48 overflow-y-auto">
                {searchResults.map((result) => (
                  <li
                    key={result._id}
                    className="p-2 text-black hover:bg-gray-100 cursor-pointer"
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
              className="hover:bg-[#3B5DAA] bg-[#1E3A8A] text-white p-3 rounded-full transition duration-300 hover:shadow-lg"
            >
              <Filter size={24} />
            </button>

            <Link to="/profile">
              <button className="hover:bg-[#3B5DAA] bg-[#1E3A8A] text-white p-3 rounded-full transition duration-300 hover:shadow-lg">
                <User size={24} />
              </button>
            </Link>
            <Link to="/logout" className="logout-button">
              Logout
            </Link>
          </div>
        </div>
      </div>

      {isFilterOpen && (
        <div className="container mx-auto mt-4 p-4 bg-white text-[#1E3A8A] rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Filters</h3>
          <div className="flex flex-wrap gap-4">
            <select
              className="p-2 border rounded bg-[#F3F4F6] text-[#374151]"
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
              className="bg-[#10B981] text-white p-2 rounded-lg shadow hover:bg-[#059669] hover:shadow-lg transition duration-300"
            >
              Apply Filters
            </button>
            <button
              onClick={() => {
                setCategory("");
                navigate("/articles");
              }}
              className="bg-red-500 text-white p-2 rounded-lg shadow hover:bg-[#c11e1b] hover:shadow-lg transition duration-300"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
