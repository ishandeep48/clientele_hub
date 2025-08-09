import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../common/Logo.tsx';
import './Sidebar.css';

// Import your SVG icons
import { ReactComponent as DashboardIcon } from '../../assets/icons/dashboard.svg';
import { ReactComponent as OrdersIcon } from '../../assets/icons/orders.svg';
import { ReactComponent as AccountIcon } from '../../assets/icons/account.svg';
import { ReactComponent as LogoutIcon } from '../../assets/icons/logout.svg';
import { ReactComponent as BillingIcon } from '../../assets/icons/billing.svg';
import { ReactComponent as SupportIcon } from '../../assets/icons/support.svg';
import { ReactComponent as FeedbackIcon } from '../../assets/icons/feedback.svg';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

interface MenuItem {
  name: string;
  path?: string;
  icon: React.ReactNode;
  action?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar }) => {
  const handleLogout = () => {
    localStorage.removeItem('userToken');
    window.location.href = '/login';
  };

  const menuItems: MenuItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { name: 'Orders', path: '/orders', icon: <OrdersIcon /> },
    { name: 'Billing', path: '/billing', icon: <BillingIcon /> },
    { name: 'Support', path: '/support', icon: <SupportIcon /> },
    { name: 'Feedback', path: '/feedback', icon: <FeedbackIcon /> },
    { name: 'Account', path: '/account', icon: <AccountIcon /> },
    { name: 'Logout', icon: <LogoutIcon />, action: handleLogout },
  ];

  return (
    <div className={`sidebar ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="sidebar-header" onClick={toggleSidebar}>
        <Logo />
        {!isCollapsed && <span className="logo-text"></span>}
      </div>

      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name}>
              {item.path ? (
                <NavLink
                  to={item.path}
                  className={({ isActive }) => (isActive ? 'active-link' : '')}
                >
                  {item.icon}
                  {!isCollapsed && <span>{item.name}</span>}
                </NavLink>
              ) : (
                <button onClick={item.action} className="logout-button">
                  {item.icon}
                  {!isCollapsed && <span>{item.name}</span>}
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
