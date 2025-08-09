import React from 'react';
import { ReactComponent as BoxIcon } from '../../assets/icons/box.svg';
// Assuming other icons might be used in a real app,
// but for this example, only BoxIcon is explicitly imported and used.
// import { ReactComponent as PaymentsIcon } from '../../assets/icons/payments.svg';
// import { ReactComponent as SupportIcon } from '../../assets/icons/support.svg';

// Define the interface for the props that StatsCard expects.
interface StatsCardProps {
  title: string;
  value: string | number; // Value can be a string (e.g., currency) or a number
  change: string;
  // Define a union type for the 'icon' prop to restrict its possible string values.
  icon: 'orders' | 'payments' | 'support' | 'default';
}

// Destructure the props and apply the StatsCardProps interface.
const StatsCard = ({ title, value, change, icon }: StatsCardProps) => {
  // Explicitly type the return value of renderIcon as React.ReactElement or null
  const renderIcon = (): React.ReactElement => {
    switch (icon) {
      case 'orders':
        return <BoxIcon />;
      case 'payments':
        return <BoxIcon />;
      case 'support':
        return <BoxIcon />;
      default:
        return <BoxIcon />; // Fallback icon
    }
  };

  return (
    <div className="stats-card">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
        <div className="card-icon">
          {renderIcon()}
        </div>
      </div>
      <p className="card-value">{value}</p>
      <p className="card-change">{change}</p>
    </div>
  );
};

export default StatsCard;