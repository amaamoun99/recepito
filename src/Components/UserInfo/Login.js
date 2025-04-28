import './Login.css';
import React, { useState } from "react";

const Login = ({ users, goToRegister, onLoginSuccess }) => {
  const [credentials, setCredentials] = useState({ Username: "", Password: "" });
  const [message, setMessage] = useState("");

  const inputHandler = (e) => {
    setCredentials({ ...credentials, [e.target.id]: e.target.value });
  };

  const loginHandler = (e) => {
    e.preventDefault();
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
        <p className="login-slogan">Welcome back to recepito</p>
      </header>
      <form>
        <input id="Username" type="text" placeholder="Username" onChange={inputHandler} />
        <input id="Password" type="password" placeholder="Password" onChange={inputHandler} />
        <button onClick={loginHandler}>Login</button>
      </form>
      {message && <p className="login-message">{message}</p>}
      <p className="login-switch">
        Don&apos;t have an account?{" "}
        <span className="login-link" onClick={goToRegister}>Register</span>
      </p>
    </div>
  );
};

export default Login;
