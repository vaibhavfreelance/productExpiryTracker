import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import { useAuth } from "../context/AuthContext";
import "../pages/Auth.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function AuthUI() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  const switchMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: "", email: "", password: "" });
    setShowPassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/auth/login" : "/auth/register";

    try {
      const res = await axios.post(endpoint, formData);

      if (res.data.token) {
        login(res.data.token);
        navigate("/");
      } else {
        alert(res.data.message || "Success");
        setIsLogin(true);
        setFormData({ name: "", email: "", password: "" });
      }
    } catch (err) {
      console.error("❌ Login/Signup error:", err);
      alert(
        err.response?.data?.message ||
          "❌ Error occurred during authentication."
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? "Login" : "Create Account"}</h2>
        <p>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span className="switch-link" onClick={switchMode}>
            {isLogin ? " Sign up" : " Sign in"}
          </span>
        </p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
        </form>
      </div>
    </div>
  );
}
