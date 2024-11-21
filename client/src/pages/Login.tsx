import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "src/components/PageWrapper";

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


      console.log("REACT_APP_API_URL:", process.env.REACT_APP_API_URL);

      
      

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

      if (formType === "login") {
        const { token } = data;
        localStorage.setItem("authToken", token);
        localStorage.setItem("username", formData.username);
        alert("Login successful!");
        navigate(`/user/${formData.username}`);
      } else {
        alert("Account created successfully!");
        setFormType("login"); // Switch to login form after successful registration
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred. Please try again.");
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
      {error && <p className="error">{error}</p>}
      <button onClick={() => setFormType(formType === "login" ? "register" : "login")}>
        {formType === "login" ? "Create Account" : "Login"}
      </button>
    </PageWrapper>
  );
};

export default Login;
