import {FunctionComponent, PropsWithChildren} from 'react';

/**
 * A wrapper around a user-provided Loader.
 * When used, it will override the default NLUX Loader.
 */
export const Loader: FunctionComponent<PropsWithChildren> = (props) => {
    return <>{props.children}</>;
};
