import {compLoaderClassName} from '@nlux/core';
import React from 'react';

export const LoaderComp = () => {
    return (
        <div className={compLoaderClassName}>
            <div className="spn_ldr_ctn"><span className="spn_ldr"></span></div>
        </div>
    );
};
