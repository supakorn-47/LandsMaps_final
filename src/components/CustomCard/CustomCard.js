import React from "react";
import "./CustomCard.scss";

const CustomCard = ({ children, title, body, footer }) => {
  return (
    <div className="custom-card">
      <div className="custom-card-wrapper">
        {children ? (
          children
        ) : (
          <>
            {title && <div className="custom-card-wrapper-title">{title}</div>}
            {body && <div className="custom-card-wrapper-body">{body}</div>}
            {footer && (
              <div className="custom-card-wrapper-footer">{footer}</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CustomCard;
