import React from "react";
const ComponentToPrint = React.forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      className="print-source"
      style={{ position: "relative", height: "100%", width: "100%" }}
    >
      {props.children}
      <style type="text/css" media="print">
        {`@page { size: landscape; }`}
      </style>
    </div>
  );
});
export default ComponentToPrint;
