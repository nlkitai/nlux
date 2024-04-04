import './Header.css';
import {ReactNode, useCallback} from 'react';
import {State} from '../../@types/State.ts';

export type HeaderProps = {
    children?: ReactNode;
    state?: State;
}

export const Header = (props: HeaderProps) => {
    const debugState = useCallback(() => {
        console.log('state:');
        console.log(JSON.stringify(props.state, null, 2));
    }, [props.state]);

    const debugFilter = useCallback(() => {
        console.log('appliedFilter:');
        console.log(JSON.stringify(props.state?.appliedFilter, null, 2));
    }, [props.state]);

    const debugSelected = useCallback(() => {
        console.log('selected:');
        console.log(JSON.stringify(
            props.state?.stockRows?.filter(item => item.selected), null,
            2,
        ));
    }, [props.state]);

    return (
        <div className="header">
            <h1>{props.children}</h1>
            <div>
                <span className="debug" onClick={debugState}>[ state ]</span>
                <span className="debug" onClick={debugFilter}>[ filter ]</span>
                <span className="debug" onClick={debugSelected}>[ selected ]</span>
            </div>
        </div>
    );
};
