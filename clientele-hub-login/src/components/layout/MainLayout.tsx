// src/layouts/MainLayout.tsx

import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../dashboard/Sidebar.tsx';
import Topbar from '../dashboard/Topbar.tsx';
import Chatbot from '../chatbot/Chatbot.tsx'; // ✅ Import chatbot
import { useModal } from '../../context/ModalContext.tsx'; // ✅ Modal visibility context
import './MainLayout.css';

const MainLayout: React.FC = () => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const location = useLocation();

  const isDashboard = location.pathname === '/dashboard';
  const { isModalOpen } = useModal(); // ✅ Get modal status

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  return (
    <div className="layout-container">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
      />
      <div className={`main-section ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        {isDashboard && <Topbar />}
        <Outlet />
        {!isModalOpen && <Chatbot />} {/* ✅ Show only if no modal open */}
      </div>
    </div>
  );
};

export default MainLayout;

