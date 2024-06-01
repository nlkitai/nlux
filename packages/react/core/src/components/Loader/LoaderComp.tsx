import {className as compLoaderClassName} from '@shared/components/Loader/create';

export const LoaderComp = () => {
    return (
        <div className={compLoaderClassName}>
            <div className="spn_ldr_ctn"><span className="spn_ldr"></span></div>
        </div>
    );
};
