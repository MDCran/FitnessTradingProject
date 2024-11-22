import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "src/components/PageWrapper";
import { motion } from "framer-motion";
import "src/css/media.css";
import "src/css/style.css";

const Login = () => {

  const [formType, setFormType] = useState("login");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [success, setSuccess] = useState(false);


  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "https://fitknights.xyz";
      const url = `${apiUrl}/api/${formType === "login" ? "login" : "register"}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          formType === "login"
            ? { username: formData.username, password: formData.password }
            : formData
        ),
      });
  
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "An error occurred");
        return;
      }
  
      if (formType === "register") {
        setSuccess(true); // Show animation
        setTimeout(() => setSuccess(false), 3000); // Hide animation after 3 seconds
      }
  
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("username", formData.username);
      alert(
        formType === "login"
          ? "Login successful!"
          : "Account created successfully!"
      );
      navigate(`/user/${formData.username}`);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };
  
  return (
    <PageWrapper title="Login or Sign Up!">
      <div className=" bg-white min-h-screen flex items-center justify-center ">
        <motion.div
          className="bg-white p-8 rounded-lg shadow-2xl w-100"
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
                  className=" bg-white input input-bordered w-full rounded-lg p-4 shadow-md focus:ring-4 focus:ring-purple-300"
                  whileFocus={{ scale: 1.05 }}
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                 
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="input input-bordered w-full rounded-lg p-4 bg-white shadow-md focus:ring-4 focus:ring-purple-300"
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
              className="input bg-white input-bordered w-full rounded-lg p-4 shadow-md focus:ring-4 focus:ring-purple-300"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="input bg-white input-bordered w-full rounded-lg p-4 shadow-md focus:ring-4 focus:ring-purple-300"
            />
            {formType === "register" && (
              

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="input bg-white input-bordered w-full rounded-lg p-4 shadow-md focus:ring-4 focus:ring-purple-300"
              />
              
            )}
            

<motion.button
  type="submit"
  className="btn w-full btn-accent text-white rounded-full text-lg p-4 shadow-md hover:bg-purple-600 transition-all"
  whileHover={{ scale: 1.05 }}
>
  {formType === "login" ? "Login" : "Create Account"}
</motion.button>

          </form>
          <div className="flex flex-col items-center space-y-4 mt-6">
          <motion.button
  onClick={() =>
    setFormType(formType === "login" ? "register" : "login")
  }
  className="btn  w-full btn-accent text-white text-lg p-4 hover:bg-purple-600 shadow-md rounded-full"
  whileHover={{ scale: 1.1 }}
>
  {formType === "login" ? "Create Account" : "Login"}
</motion.button>
{formType === "register" && success && (
  <motion.div
    className="absolute inset-0 flex items-center justify-center pointer-events-none"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1, y: [0, -10, 0] }}
    transition={{ duration: 1 }}
  >
    🎉 🎊
  </motion.div>
)}


          </div>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default Login;
