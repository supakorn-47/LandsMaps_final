import React, { useState, useEffect } from 'react';
import * as loading_spin from "./loading_spin.json";
import * as successData from "./success.json";
import Lottie from "react-lottie";
import './Loading.css';

const loadOption = {
    loop: true,
    autoplay: true,
    animationData: loading_spin.default,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
};

const loadOption2 = {
    loop: true,
    autoplay: true,
    animationData: successData.default,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
};

export const Loading = ({ loading }) => {

    return (
        <>
            {loading ? (
                <div className="__loading p-component-overlay" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
                    <Lottie options={loadOption} height={180} width={180} />
                </div>
            ) : ''}
        </>
    )
}

export const LoadingSuccess = ({ loading, success = false }) => {

    return (
        <div>
            {!success ? (
                <>
                    <div className="__loading p-component-overlay" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
                        {!loading ? (
                            <Lottie options={loadOption} height={180} width={180} />
                        ) : (
                                <Lottie options={loadOption2} height={180} width={180} />
                            )}
                    </div>
                </>
            ) : ''}
        </div>
    )
}
