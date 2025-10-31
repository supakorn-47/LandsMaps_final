import React from "react";
import "./PageHeader.scss";

const PageHeader = ({
  config: { title, subtitle, actionButton },
  children,
}) => {
  return (
    <header className="page-header">
      {!children ? (
        <div className="page-header-wrapper">
          <div className="page-header-wrapper-left">
            {title && <div className="page-header-wrapper-title">{title}</div>}
            {subtitle && (
              <div className="page-header-wrapper-subtitle">{subtitle}</div>
            )}
          </div>
          {actionButton && (
            <div className="page-header-wrapper-right">{actionButton}</div>
          )}
        </div>
      ) : (
        children
      )}
    </header>
  );
};

export default PageHeader;
