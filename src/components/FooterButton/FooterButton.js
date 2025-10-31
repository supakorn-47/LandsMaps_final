import React from "react";
import { Button } from "primereact/button";

export default function footerButton({ onClickOk, onClickCancle, disabled }) {
  return (
    <div className="dialog-footer-action-right">
      <Button
        label="ยกเลิก"
        icon="pi pi-times"
        onClick={() => onClickCancle()}
        // style={{ backgroundColor: "rgb(167 172 175)", color: "#ffffff" }}
        className="p-button-rounded p-button-secondary"
      />
      <Button
        label="ตกลง"
        icon="pi pi-check"
        onClick={() => onClickOk()}
        // style={{ marginLeft: 5 }}
        className="p-button-rounded p-button-info"
        disabled={disabled}
      />
    </div>
  );
}

export const FooterButtonCenter = ({ onClickOk, onClickCancle, disabled }) => {
  return (
    <div className="dialog-footer-action-center">
      <Button
        label="ยกเลิก"
        icon="pi pi-times"
        onClick={() => onClickCancle()}
        className="p-button-secondary p-button-rounded"
      />
      <Button
        label="ตกลง"
        icon="pi pi-check"
        onClick={() => onClickOk()}
        // style={{ marginLeft: 5, backgroundColor: "#007bff", color: "#ffffff" }}
        className="p-button-rounded p-button-info"
        disabled={disabled}
      />
    </div>
  );
};

export const FooterButtonCancel = ({ onClickOk, onClickCancle }) => {
  return (
    <div className="dialog-footer-action-center">
      <Button
        label="ยกเลิก"
        icon="pi pi-times"
        onClick={() => onClickCancle()}
        // style={{ backgroundColor: "#607D8B", color: "#ffffff" }}
        className="p-button-rounded p-button-secondary"
      />
    </div>
  );
};
