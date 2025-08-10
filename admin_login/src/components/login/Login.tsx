import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent)=>{
    e.preventDefault();
    setError('');

    const mail : String = credentials.email;
    const password: String = credentials.password.trim();

    axios.post("http://localhost:5000/admin/login",{mail,password})
    .then(res=> {
      if(res.data.isLoggedIn){
      localStorage.setItem("token",res.data.token);
      navigate("/dashboard");
      }else{
        setError('Invalid email or passowrd. Try again');
      }
    })
    .catch(err=> console.warn(err));


  };
  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="logo-placeholder">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path fill="#4F46E5" d="M12 2L2 7l10 5 10-5-10-5zm0 7L2 14l10 5 10-5-10-5z" />
          </svg>
        </div>
        <h2 className="login-title">Admin Portal</h2>
        <p className="login-subtitle">Enter your credentials to access the dashboard.</p>

        {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}

        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="admin@example.com"
          value={credentials.email}
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={credentials.password}
          onChange={handleChange}
          required
        />

        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
};

export default Login;
