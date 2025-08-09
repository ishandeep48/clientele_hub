import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../common/Logo.tsx'
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() !== '' && password.trim() !== '') {
      localStorage.setItem('userToken', 'mock-token-123');
      navigate('/dashboard');
    } else {
      alert('Please enter both email and password.');
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        <Logo />
        <div className="login-content">
          <h2 className="login-title">Login</h2>
          <p className="login-subtitle">Enter your email below to login to your account.</p>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="abc@gmail.com"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" className="login-button">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;