import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "src/components/PageWrapper";
import { motion } from "framer-motion";
import "src/css/media.css";
import "src/css/style.css";

const Login: React.FC = () => {
  const [formType, setFormType] = useState<"login" | "register">("login");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    if (formType === "register" && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const apiUrl = process.env.REACT_APP_API_URL || "https://fitness-trading-project.vercel.app";
      const endpoint = formType === "login" ? "login" : "register";
      const url = `${apiUrl}/api/${endpoint}`;
      console.log("Constructed URL:", url); // Debugging: log the constructed URL

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          formType === "login"
            ? { username: formData.username, password: formData.password }
            : {
                firstName: formData.firstName,
                lastName: formData.lastName,
                username: formData.username,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
              }
        ),
      });
  
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "An error occurred. Please try again.");
        return;
      }

      const { token } = data;

      if (formType === "login" || formType === "register") {
        // Save the token and username in localStorage
        localStorage.setItem("authToken", token);
        localStorage.setItem("username", formData.username);

        alert(formType === "login" ? "Login successful!" : "Account created and logged in successfully!");

        // Navigate to the user's profile page
        navigate(`/user/${formData.username}`);

        // Reload the page to update the navbar
        window.location.reload();
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <PageWrapper title="Login or Sign Up" >
      <div className="bg-white min-h-screen flex items-center justify-center">
        <motion.div
          className="bg-white p-8 rounded-lg shadow-2xl w-85 h-50"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          whileHover={{ scale: 1.02 }}
        >
          <h2 className="text-3xl font-bold text-center text-accent mb-6">
            {formType === "login" ? "Login" : "Create Account"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {formType === "register" && (
              <>
                <motion.input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="bg-white input input-bordered w-full rounded-lg p-4 shadow-md focus:ring-4 focus:ring-purple-300"
                  whileFocus={{ scale: 1.05 }}
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="input input-bordered w-full rounded-lg p-4 shadow-md focus:ring-4 focus:ring-purple-300"
                />
              </>
            )}
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="input input-bordered w-full rounded-lg p-4 shadow-md focus:ring-4 focus:ring-purple-300"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="input input-bordered w-full rounded-lg p-4 shadow-md focus:ring-4 focus:ring-purple-300"
            />
            {formType === "register" && (
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="input input-bordered w-full rounded-lg p-4 shadow-md focus:ring-4 focus:ring-purple-300"
              />
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="btn w-full btn-accent text-white rounded-full text-lg p-4 shadow-md hover:bg-purple-600 transition-all"
              whileHover={{ scale: 1.05 }}
            >
              {formType === "login" ? "Login" : "Create Account"}
            </motion.button>
          </form>

          {/* Display error message */}
          {error && <p className="text-red-500 mt-4">{error}</p>}

          {/* Toggle between Login and Register */}
          <div className="flex flex-col items-center space-y-4 mt-6">
            <motion.button
              onClick={() => setFormType(formType === "login" ? "register" : "login")}
              className="btn w-full btn-accent text-white text-lg p-4 hover:bg-purple-600 shadow-md rounded-full"
              whileHover={{ scale: 1.1 }}
            >
              {formType === "login" ? "Create Account" : "Login"}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default Login;
