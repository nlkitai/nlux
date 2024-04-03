import {className as loaderDomClassName} from '@nlux-dev/core/src/comp/Loader/create';
import React from 'react';

export const LoaderComp = () => {
    return (
        <div className={loaderDomClassName}>
            <div className="spn_ldr_ctn"><span className="spn_ldr"></span></div>
        </div>
    );
};
