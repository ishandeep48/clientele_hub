import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' , name:''});
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
    const name: String = credentials.name.trim();


    axios.post("http://localhost:5000/admin/signup",{mail,password,name})
    .then(res=> {
      if(res.data.status){
      alert('Created Admin')
      navigate("/login");
      }else{
        setError('Couldnt create');
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
        <p className="login-subtitle">Enter your credentials to create a new account.</p>

        {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}

<label>Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter your Name"
          value={credentials.name}
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your Email"
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

        <button type="submit" className="login-button">Signup</button>
      </form>
    </div>
  );
};

export default Login;
