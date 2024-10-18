import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    categories: [],
  });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("auth")) || ""
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      toast.warn("Please login first to access the profile");
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      let axiosConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/profile",
          axiosConfig
        );
        setUserData(response.data.user);
        setSelectedCategories(response.data.user.categories || []);
      } catch (error) {
        toast.error("Failed to fetch user data");
      }
    };

    if (token) fetchUserData();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedCategories((prev) => [...prev, value]);
    } else {
      setSelectedCategories((prev) =>
        prev.filter((category) => category !== value)
      );
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedData = { ...userData, categories: selectedCategories };
      let axiosConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.put(
        "http://localhost:5000/api/v1/profile/update",
        updatedData,
        axiosConfig
      );
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4 sm:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-[#1E3A8A]">
        Edit Profile
      </h2>
      <form
        onSubmit={handleProfileUpdate}
        className="bg-white shadow-md rounded-lg p-6 sm:p-8 w-full max-w-lg"
      >
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition duration-300"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-400"
            disabled
          />
        </div>

        {/* Category Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Select your interests:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "news",
              "business",
              "health",
              "entertainment",
              "sport",
              "politics",
            ].map((category) => (
              <label key={category} className="flex items-center">
                <input
                  type="checkbox"
                  value={category}
                  checked={selectedCategories.includes(category)}
                  onChange={handleCategoryChange}
                  className="mr-2 accent-[#1E3A8A] focus:ring-[#1E3A8A] focus:ring-2"
                />
                <span className="capitalize">{category}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#1E3A8A] text-white p-3 rounded-md hover:bg-[#3B5DAA] transition duration-300"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
