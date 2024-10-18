import React, { useEffect, useState } from "react";
import Image from "../assets/image.png";
import Logo from "../assets/logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("auth")) || ""
  );
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (email && password) {
      const formData = { email, password };

      try {
        const response = await axios.post(
          "http://localhost:5000/api/v1/login",
          formData
        );
        localStorage.setItem("auth", JSON.stringify(response.data.token));
        toast.success("Login successful");
        navigate("/articles");
      } catch (err) {
        toast.error(err.response?.data?.message || "Login failed");
      }
    } else {
      toast.error("Please fill all inputs");
    }
  };

  useEffect(() => {
    if (token) {
      toast.success("You are already logged in");
      navigate("/articles");
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      <div className="flex-1 flex items-center justify-center">
        <img src={Image} alt="Login Illustration" className="max-w-full" />
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
          <div className="flex justify-center mb-4">
            <img src={Logo} alt="Logo" className="h-12" />
          </div>
          <h2 className="text-2xl font-bold text-center mb-2">Welcome back!</h2>
          <p className="text-center mb-6">Please enter your details</p>
          <form onSubmit={handleLoginSubmit}>
            <div className="mb-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4 relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {showPassword ? (
                <FaEyeSlash
                  className="absolute right-3 top-2 cursor-pointer text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                />
              ) : (
                <FaEye
                  className="absolute right-3 top-2 cursor-pointer text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                />
              )}
            </div>
            <div className="flex justify-between mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember-checkbox"
                  className="mr-2"
                />
                <label htmlFor="remember-checkbox">Remember for 30 days</label>
              </div>
              <Link to="#" className="text-blue-500 hover:underline">
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Log In
            </button>
          </form>
          <p className="text-center mt-4">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
