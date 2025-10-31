import React from "react";
import { Card } from "primereact/card";
import "./SummaryCard.css";

export function SummaryCard({ icon, title, value, description, iconColor }) {
  return (
    <Card className="summary-card p-shadow-2">
      <div className="p-grid p-nogutter align-items-start">
        <div className={`summary-icon p-col-fixed ${iconColor}`}>
          <i className={`${icon} pi-icon`} />
        </div>
        <div className="p-col summary-text">
          <h3 className="summary-title">{title}</h3>
          <div className="summary-value">{value}</div>
          <p className="summary-description">{description}</p>
        </div>
      </div>
    </Card>
  );
}
