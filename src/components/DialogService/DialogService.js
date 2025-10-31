import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

export const DialogDelete = ({
  header,
  visible,
  width,
  footer,
  onHide,
  textContent,
  style = { width: 400 },
}) => {
  return (
    <Dialog
      header={header}
      visible={visible}
      modal
      style={style}
      contentStyle={{ marginTop: "14px" }}
      className="p-fluid"
      footer={footer}
      onHide={onHide}
      focusOnShow={false}
    >
      <div className="confirmation-content" style={{ paddingTop: "0em" }}>
        <h3 style={{ margin: "0px", color: "#625f5f" }}>{textContent}</h3>
      </div>
    </Dialog>
  );
};

export const DialogConfirm = ({
  header,
  visible,
  width,
  footer,
  onHide,
  textContent,
  style = { width: 400 },
  checkTextConTent = false,
}) => {
  return (
    <Dialog
      header={header}
      visible={visible}
      modal
      style={style}
      contentStyle={{ marginTop: "14px" }}
      className="p-fluid"
      footer={footer}
      onHide={onHide}
    >
      <div style={{ minHeight: "100px !important" }}>
        <div className="confirmation-content" style={{ paddingTop: "0em" }}>
          <h4 style={{ margin: "0px", color: "#625f5f" }}>{textContent}</h4>
        </div>
        <div style={{ textAlign: "center" }}>
          {checkTextConTent === true ? (
            <h4 style={{ margin: "0px", color: "#625f5f" }}>ใช่หรือไม่ ?</h4>
          ) : (
            ""
          )}
        </div>
      </div>
    </Dialog>
  );
};

export const DialogWarning = ({
  header,
  visible,
  width,
  onHide,
  textContent,
  btnOk,
  btnCancle,
}) => {
  const renderFooter = () => {
    return (
      <div className="dialog-footer-action-center">
        <Button
          label="ยกเลิก"
          icon="pi pi-times"
          onClick={() => btnCancle()}
          // style={{ backgroundColor: "#607D8B", color: "#ffffff" }}
          className="p-button-rounded p-button-secondary"
        />
        <Button
          label="ตกลง"
          icon="pi pi-check"
          onClick={() => btnOk()}
          className="p-button-rounded p-button-info"
        />
      </div>
    );
  };

  return (
    <Dialog
      blockScroll={true}
      header={header}
      visible={visible}
      modal
      style={{ width: 400 }}
      contentStyle={{ marginTop: "15px" }}
      className="p-fluid"
      footer={renderFooter()}
      onHide={onHide}
    >
      <div className="confirmation-content" style={{ paddingTop: "0em" }}>
        <h4 style={{ margin: "0px", color: "#625f5f" }}>{textContent}</h4>
      </div>
    </Dialog>
  );
};
