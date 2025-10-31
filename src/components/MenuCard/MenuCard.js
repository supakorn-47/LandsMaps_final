import React from 'react';
import { Card } from 'primereact/card';
import './MenuCard.css';

const MenuCard = ({ icon, title, subtitle, bgColor, link, onClick }) => {
  return (
    <a href={link} className="menu-card-link" onClick={onClick}>
      <Card className={`menu-card ${bgColor}`}>
        <div className="menu-card-content">
          <div className={`menu-card-icon ${bgColor}`}>
            <i className={`pi ${icon}`} />
          </div>
          <div className="menu-card-text">
            <h2 className="menu-card-title">{title}</h2>
            {subtitle && <p className="menu-card-subtitle">{subtitle}</p>}
          </div>
        </div>
      </Card>
    </a>
  );
};

export default MenuCard; 