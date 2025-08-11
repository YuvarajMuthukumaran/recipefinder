import React, { useState, useEffect } from "react";

export default function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const validate = () => {
    const errs = {};
    if (!formData.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = "Email is invalid";

    if (!formData.password) errs.password = "Password is required";
    else if (formData.password.length < 6) errs.password = "Password must be at least 6 characters";

    if (!isLogin) {
      if (!formData.name) errs.name = "Name is required";
      if (!formData.confirmPassword) errs.confirmPassword = "Please confirm your password";
      else if (formData.password !== formData.confirmPassword) errs.confirmPassword = "Passwords do not match";
    }
    return errs;
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      try {
        const url = isLogin ? "http://localhost:5000/login" : "http://localhost:5000/signup";
        const body = isLogin
          ? { email: formData.email, password: formData.password }
          : { name: formData.name, email: formData.email, password: formData.password };

        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();

        if (res.ok) {
          if (isLogin) {
            showNotification(`Welcome back, ${data.user.name}!`, "success");
            localStorage.setItem("user", JSON.stringify(data.user));
            onLogin(data.user);
          } else {
            showNotification("User registered! Please login.", "success");
            setIsLogin(true);
            setFormData({ name: "", email: "", password: "", confirmPassword: "" });
          }
        } else {
          showNotification(data.message || "Error occurred", "error");
        }
      } catch (err) {
        showNotification("Server error", "error");
        console.error(err);
      }
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "50px auto",
        padding: 20,
        border: "1px solid #ccc",
        borderRadius: 8,
        fontFamily: "Arial, sans-serif",
        position: "relative",
      }}
    >
      {notification && (
        <div
          style={{
            position: "absolute",
            top: 10,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "10px 20px",
            borderRadius: 5,
            color: "white",
            backgroundColor: notification.type === "success" ? "#4caf50" : "#f44336",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            zIndex: 1000,
            fontWeight: "bold",
            minWidth: 200,
            textAlign: "center",
          }}
        >
          {notification.message}
        </div>
      )}

      <h2 style={{ textAlign: "center", marginBottom: 20 }}>{isLogin ? "Login" : "Sign Up"}</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        {!isLogin && (
          <>
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              style={{ padding: 10, fontSize: 16 }}
            />
            {errors.name && <span style={{ color: "red", fontSize: 12 }}>{errors.name}</span>}
          </>
        )}

        <input
          name="email"
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
          style={{ padding: 10, fontSize: 16 }}
        />
        {errors.email && <span style={{ color: "red", fontSize: 12 }}>{errors.email}</span>}

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
          style={{ padding: 10, fontSize: 16 }}
        />
        {errors.password && <span style={{ color: "red", fontSize: 12 }}>{errors.password}</span>}

        {!isLogin && (
          <>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
              style={{ padding: 10, fontSize: 16 }}
            />
            {errors.confirmPassword && (
              <span style={{ color: "red", fontSize: 12 }}>{errors.confirmPassword}</span>
            )}
          </>
        )}

        <button
          type="submit"
          style={{
            padding: 12,
            fontSize: 16,
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
          }}
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>
      </form>

      <p style={{ marginTop: 20, textAlign: "center", fontSize: 14 }}>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setFormData({ name: "", email: "", password: "", confirmPassword: "" });
            setErrors({});
          }}
          style={{ background: "none", border: "none", color: "#1976d2", cursor: "pointer", fontWeight: "bold" }}
        >
          {isLogin ? "Sign Up" : "Login"}
        </button>
      </p>
    </div>
  );
}
