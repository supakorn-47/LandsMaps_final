import React from 'react';

export const validateInputText = (id, text) => {
    return (
        <small id={id} className="p-invalid p-d-block">{`กรุณาระบุ ${text}`}</small>
    );
}

export const validateInputText2 = (id, text) => {
    return (
        <small id={id} className="p-invalid p-d-block">{`${text}`}</small>
    );
}