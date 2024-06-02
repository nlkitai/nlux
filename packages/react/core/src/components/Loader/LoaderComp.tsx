import {className as compLoaderClassName} from '@shared/components/Loader/create';

export const LoaderComp = () => {
    return (
        <div className={compLoaderClassName}>
            <div className="nlux-comp-loaderContainer"><span className="spinning-loader"></span></div>
        </div>
    );
};
