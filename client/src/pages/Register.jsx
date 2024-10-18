import React, { useEffect, useState } from "react";
import Image from "../assets/image.png";
import Logo from "../assets/logo.png";
import GoogleSvg from "../assets/icons8-google.svg";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import "../styles/Register.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const navigate = useNavigate();
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("auth")) || ""
  );

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedCategories([...selectedCategories, value]);
    } else {
      setSelectedCategories(
        selectedCategories.filter((category) => category !== value)
      );
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    let name = e.target.name.value;
    let lastname = e.target.lastname.value;
    let email = e.target.email.value;
    let password = e.target.password.value;
    let confirmPassword = e.target.confirmPassword.value;

    if (
      name.length > 0 &&
      lastname.length > 0 &&
      email.length > 0 &&
      password.length > 0 &&
      confirmPassword.length > 0
    ) {
      if (password === confirmPassword) {
        const formData = {
          username: name + " " + lastname,
          email,
          password,
          categories: selectedCategories, // Send selected categories
        };
        try {
          const response = await axios.post(
            "http://localhost:5000/api/v1/register",
            formData
          );
          toast.success("Registration successful");
          navigate("/login");
        } catch (err) {
          toast.error(err.message);
        }
      } else {
        toast.error("Passwords don't match");
      }
    } else {
      toast.error("Please fill all inputs");
    }
  };

  useEffect(() => {
    if (token !== "") {
      toast.success("You already logged in");
      navigate("/articles");
    }
  }, []);

  return (
    <div className="register-main">
      <div className="register-left">
        <img src={Image} alt="" />
      </div>
      <div className="register-right">
        <div className="register-right-container">
          <div className="register-logo">
            <img src={Logo} alt="" />
          </div>
          <div className="register-center">
            <h2>Welcome to our website!</h2>
            <p>Please enter your details</p>
            <form onSubmit={handleRegisterSubmit}>
              <input
                type="text"
                placeholder="Name"
                name="name"
                required={true}
              />
              <input
                type="text"
                placeholder="Lastname"
                name="lastname"
                required={true}
              />
              <input
                type="email"
                placeholder="Email"
                name="email"
                required={true}
              />
              <div className="pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  required={true}
                />
                {showPassword ? (
                  <FaEyeSlash
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                  />
                ) : (
                  <FaEye
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                  />
                )}
              </div>
              <div className="pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  required={true}
                />
                {showPassword ? (
                  <FaEyeSlash
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                  />
                ) : (
                  <FaEye
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                  />
                )}
              </div>

              {/* Category Selection */}
              <div className="category-selection">
                <h3>Select your interests:</h3>
                <div>
                  <input
                    type="checkbox"
                    id="news"
                    value="news"
                    onChange={handleCategoryChange}
                  />
                  <label htmlFor="news">News</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="business"
                    value="business"
                    onChange={handleCategoryChange}
                  />
                  <label htmlFor="business">Business</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="health"
                    value="health"
                    onChange={handleCategoryChange}
                  />
                  <label htmlFor="health">Health</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="entertainment"
                    value="entertainment"
                    onChange={handleCategoryChange}
                  />
                  <label htmlFor="entertainment">Entertainment</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="sport"
                    value="sport"
                    onChange={handleCategoryChange}
                  />
                  <label htmlFor="sport">Sport</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="politics"
                    value="politics"
                    onChange={handleCategoryChange}
                  />
                  <label htmlFor="politics">Politics</label>
                </div>
              </div>

              <div className="register-center-buttons">
                <button type="submit">Sign Up</button>
              </div>
            </form>
          </div>

          <p className="login-bottom-p">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
