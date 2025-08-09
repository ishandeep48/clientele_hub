import React from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom'
import { Bell } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="app-header">
      <div className="header-left">
      </div>
      <div className="header-right">
        <Bell
          className="icon"
          title="View Notifications"
          onClick={() => navigate('/notifications')}
        />

        <img
          alt="User Avatar"
          title="Go to Settings"
          className="avatar"
          src="https://via.placeholder.com/32"
          onClick={() => navigate('/settings')}
        />
      </div>
    </header>
  );
};

export default Header;
