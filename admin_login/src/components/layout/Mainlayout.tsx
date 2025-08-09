import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header.tsx';
import Sidebar from '../sidebar/Sidebar.tsx';

const MainLayout: React.FC = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div className="main-container" style={{ flex: 1 }}>
        <Header />
        <main style={{ padding: '1rem', marginTop: '64px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
