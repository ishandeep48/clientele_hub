import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../common/Logo.tsx'
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (email.trim() === '' || password.trim() === '') {
      setError('Please enter both email and password.');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch('https://clientele-hub.onrender.com/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok || !data?.token) {
        setError(data?.error || 'Invalid credentials');
        setLoading(false);
        return;
      }
      localStorage.setItem('userToken', data.token);
      localStorage.setItem('userEmail', email);
      navigate('/dashboard');
    } catch (err) {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
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
                onChange={(e) => setEmail(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            {error && <div className="error-text">{error}</div>}
            <button type="submit" className="login-button" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;