import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as UserIcon } from '../../assets/icons/user.svg';
import './Topbar.css';

const Topbar = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem('userName') || 'User';
    const email = localStorage.getItem('userEmail') || 'user@example.com';

    setUserName(name);
    setUserEmail(email);
  }, []);

  const handleIconClick = () => {
    navigate('/account');
  };

  return (
    <div className="topbar">
      <h1 className="topbar-title">Welcome back, {userName.split(' ')[0]}!</h1>
      <p className="topbar-subtitle">Here's a quick summary of your recent activity.</p>
      <div
        className="user-profile"
        onClick={handleIconClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <UserIcon />
        {showTooltip && (
          <div className="user-tooltip">
            <strong>{userName}</strong>
            <p>{userEmail}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Topbar;
