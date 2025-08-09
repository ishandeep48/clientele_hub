import React from 'react';
import { ReactComponent as StackedPaperIcon } from '../../assets/icons/Stackedpaper.svg';
import './logo.css';

const Logo = () => {
  return (
    <div className="logo-container">
      <StackedPaperIcon className="logo-icon" />
      <span className="logo-text">Clientele Hub</span>
    </div>
  );
};

export default Logo;