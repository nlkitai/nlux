import {CompRenderer} from '../../../types/comp';
import {createExceptionBoxController, ExceptionsBoxController} from '../../../ui/ExceptionsBox/control';
import {createExceptionsBoxDom} from '../../../ui/ExceptionsBox/create';
import {
    CompExceptionsBoxActions,
    CompExceptionsBoxElements,
    CompExceptionsBoxEvents,
    CompExceptionsBoxProps,
} from './types';

export const renderExceptionsBox: CompRenderer<
    CompExceptionsBoxProps,
    CompExceptionsBoxElements,
    CompExceptionsBoxEvents,
    CompExceptionsBoxActions
> = ({
    props,
    appendToRoot,
}) => {
    const exceptionsBoxRoot = createExceptionsBoxDom();
    appendToRoot(exceptionsBoxRoot);

    let controller: ExceptionsBoxController | undefined = createExceptionBoxController(exceptionsBoxRoot);

    return {
        elements: {
            root: exceptionsBoxRoot,
        },
        actions: {
            displayException: (message: string, ref?: string) => {
                controller?.displayException(message, ref);
            },
        },
        onDestroy: () => {
            controller?.destroy();
            exceptionsBoxRoot.remove();
            controller = undefined;
        },
    };
};
