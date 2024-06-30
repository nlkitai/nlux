import {FunctionComponent, PropsWithChildren} from 'react';

/**
 * A wrapper around a user-provided greeting component.
 * When used, it will override the default greeting component.
 */
export const Greeting: FunctionComponent<PropsWithChildren> = (props) => {
    return <>{props.children}</>;
};
