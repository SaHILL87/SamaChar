"use client"

import React, { useState } from 'react'
import { Search, Filter, User } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleFilterToggle = () => {
    setIsFilterOpen(!isFilterOpen)
  }

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
            <Search className="absolute right-3 top-2.5 text-primary" size={20} />
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleFilterToggle}
              className="hover:bg-secondary hover:text-secondary-foreground p-2 rounded-full transition duration-300"
            >
              <Filter size={24} />
            </button>
            <Link to='/profile'>
            <button className="hover:bg-secondary hover:text-secondary-foreground p-2 rounded-full transition duration-300">
              <User size={24} />
            </button>
            </Link>
          </div>
        </div>
      </div>
      
      {isFilterOpen && (
        <div className="container mx-auto mt-4 p-4 bg-card text-card-foreground rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Filters</h3>
          <div className="flex flex-wrap gap-4">
            <select className="p-2 border rounded bg-background text-foreground">
              <option>Category</option>
              <option>Politics</option>
              <option>Technology</option>
              <option>Sports</option>
            </select>
            <select className="p-2 border rounded bg-background text-foreground">
              <option>Date</option>
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>
            <select className="p-2 border rounded bg-background text-foreground">
              <option>Source</option>
              <option>CNN</option>
              <option>BBC</option>
              <option>Reuters</option>
            </select>
          </div>
        </div>
      )}
    </nav>
  )
}