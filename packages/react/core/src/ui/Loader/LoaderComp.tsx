import React from 'react';
import {className as compLoaderClassName} from '../../../../../shared/src/ui/Loader/create';

export const LoaderComp = () => {
    return (
        <div className={compLoaderClassName}>
            <div className="spn_ldr_ctn"><span className="spn_ldr"></span></div>
        </div>
    );
};
