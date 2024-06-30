import {PropsWithChildren, ReactElement, useMemo} from 'react';
import {LoaderComp} from '../../components/Loader/LoaderComp';
import {AiChatUI, AiChatUIOverrides} from '../AiChatUI';

export const useUiOverrides = (props: PropsWithChildren): AiChatUIOverrides => {
    const possibleUiOverrides: Array<ReactElement> = useMemo(() => {
        if (!props.children) {
            return [];
        }

        return Array.isArray(props.children) ? props.children : [props.children];
    }, [props.children]);

    const Loader: ReactElement = useMemo(() => {
        if (possibleUiOverrides.length === 0) {
            return <LoaderComp/>;
        }

        const loaderOverride = possibleUiOverrides
            .find((child) => child.type === AiChatUI.Loader);
        return loaderOverride || <LoaderComp/>;
    }, [possibleUiOverrides]);

    const Greeting: ReactElement | undefined = useMemo(() => {
        if (possibleUiOverrides.length === 0) {
            return undefined;
        }

        return possibleUiOverrides
            .find((child) => child.type === AiChatUI.Greeting);
    }, [possibleUiOverrides]);

    return {
        Loader,
        Greeting,
    };
};
