import React from 'react';

const QuickActions = () => {
  // Explicitly type the event as a React.MouseEvent for an HTMLButtonElement
  const handleRaiseTicket = (e: React.MouseEvent<HTMLButtonElement>) => {
    alert('Raise a Ticket button clicked!');
    // In a real app, this would open a modal or navigate to a new page
  };

  const handleViewNotifications = (e: React.MouseEvent<HTMLButtonElement>) => {
    alert('View Notifications button clicked!');
  };

  const handleManageAccount = (e: React.MouseEvent<HTMLButtonElement>) => {
    alert('Manage Account button clicked!');
  };

  return (
    <div className="quick-actions-card">
      <div className="card-header">
        <h3 className="card-title">Quick Actions</h3>
        <p className="card-subtitle">Need help or want to see what's new?</p>
      </div>
      <div className="action-buttons">
        <button className="button-primary" onClick={handleRaiseTicket}>Raise a Ticket</button>
        <button className="button-secondary" onClick={handleViewNotifications}>View Notifications</button>
        <button className="button-tertiary" onClick={handleManageAccount}>Manage Account</button>
      </div>
    </div>
  );
};

export default QuickActions;