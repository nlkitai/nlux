import {FunctionComponent, PropsWithChildren} from 'react'

/**
 * A wrapper around a user-provided Composer component.
 * When used, it will override the default Composer component.
 */
export const Composer: FunctionComponent<PropsWithChildren> = (props) => {
    return <>{props.children}</>
};
