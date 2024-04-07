import {LoaderComp} from '@nlux-dev/react/src/ui/Loader/LoaderComp.tsx';
import '@nlux-dev/themes/src/naked/components/Loader.css';
import '@nlux-dev/themes/src/naked/components/animation.css';

export const LoaderReactExpo = () => {
    return (
        <div style={{border: '2px solid #B0B0B0', padding: 20, margin: 20, borderRadius: 10}}>
            <div className="expo-container" style={{borderBottom: '1px dashed #B0B0B0', marginBottom: 20}}>
                <h3>Loader Comp</h3>
            </div>
            <div className="Loader-expo nlux_root">
                <div className="content">
                    <LoaderComp/>
                </div>
            </div>
        </div>
    );
};
