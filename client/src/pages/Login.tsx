import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "src/components/PageWrapper";

const Login = () => {
  const [formType, setFormType] = useState("login");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: ""
  });

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Determine API URL based on environment
      const apiUrl = process.env.REACT_APP_API_URL || "https://fitness-trading-project.vercel.app";
      const url = `${apiUrl}/api/${formType === "login" ? "login" : "register"}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(
          formType === "login"
            ? { username: formData.username, password: formData.password }
            : formData
        )
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "An error occurred");
        return;
      }

      // Store token and redirect to profile page
      const token = data.token;
      localStorage.setItem("authToken", token);
      alert(formType === "login" ? "Login successful!" : "Account created successfully!");

      // Redirect to profile page without '@' in the URL
      navigate(`/user/${formData.username}`);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <PageWrapper title="Login">
      <h2>{formType === "login" ? "Login" : "Create Account"}</h2>
      <form onSubmit={handleSubmit}>
        {formType === "register" && (
          <>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              required
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
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        {formType === "register" && (
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
        )}
        <button type="submit">
          {formType === "login" ? "Login" : "Create Account"}
        </button>
      </form>
      <button onClick={() => setFormType(formType === "login" ? "register" : "login")}>
        {formType === "login" ? "Create Account" : "Login"}
      </button>
    </PageWrapper>
  );
};

export default Login;
