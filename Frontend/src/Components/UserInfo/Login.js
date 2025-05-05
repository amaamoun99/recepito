import React, { useState } from "react";
import './Login.css';

const Login = ({ users, goToRegister, onLoginSuccess }) => {
  const [credentials, setCredentials] = useState({ Username: "", Password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const inputHandler = (e) => {
    const { id, value } = e.target;
    setCredentials(prev => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!credentials.Username.trim()) {
      newErrors.Username = "Username is required";
    }
    if (!credentials.Password) {
      newErrors.Password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loginHandler = (e) => {
    e.preventDefault();
    setMessage("");
    
    if (!validateForm()) return;

    const found = users.find(
      (u) => u.Username === credentials.Username && u.Password === credentials.Password
    );
    
    if (found) {
      if (onLoginSuccess) onLoginSuccess(found);
    } else {
      setMessage("Invalid username or password!");
    }
  };

  return (
    <div className="login-bg">
      <header className="login-header">
        <h1>Login</h1>
        <p className="login-slogan">Welcome back to Recepito</p>
      </header>
      <form>
        <div className="input-group">
          <label htmlFor="Username">Username</label>
          <input 
            id="Username" 
            type="text" 
            placeholder="Enter your username" 
            onChange={inputHandler}
            className={errors.Username ? "error" : ""}
          />
          {errors.Username && <span className="error-message">{errors.Username}</span>}
        </div>
        
        <div className="input-group">
          <label htmlFor="Password">Password</label>
          <input 
            id="Password" 
            type="password" 
            placeholder="Enter your password" 
            onChange={inputHandler}
            className={errors.Password ? "error" : ""}
          />
          {errors.Password && <span className="error-message">{errors.Password}</span>}
        </div>
        
        <button type="submit" onClick={loginHandler}>Login</button>
      </form>
      {message && <p className="login-message">{message}</p>}
      <p className="login-switch">
        Don't have an account?{" "}
        <span className="login-link" onClick={goToRegister}>Register</span>
      </p>
    </div>
  );
};

export default Login;