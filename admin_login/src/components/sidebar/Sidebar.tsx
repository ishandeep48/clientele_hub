import React, { useState } from 'react';
import { sidebarItems } from '../icons/SidebarIcons.tsx';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user session
    localStorage.removeItem("token"); // or sessionStorage.clear() if used
    // Redirect to login
    navigate('/login');
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <span
          className="logo-icon"
          onClick={() => setCollapsed(!collapsed)}
          style={{ cursor: 'pointer' }}
        >
          {collapsed ? '🧱' : '🧱 Admin Portal'}
        </span>
      </div>

      <ul className="sidebar-menu">
        {sidebarItems.map((item, index) => (
          <li
            key={index}
            className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => {
              if (item.label === 'Logout') {
                handleLogout();
              }
            }}
          >
            {item.label === 'Logout' ? (
              <span className="menu-link" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <span className="icon">{item.icon}</span>
                {!collapsed && <span className="label">{item.label}</span>}
              </span>
            ) : (
              <Link to={item.path} className="menu-link">
                <span className="icon">{item.icon}</span>
                {!collapsed && <span className="label">{item.label}</span>}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
