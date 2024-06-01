import {
    createExceptionsBoxController,
    ExceptionsBoxController,
} from '../../../../../../shared/src/components/ExceptionsBox/control';
import {createExceptionsBoxDom} from '../../../../../../shared/src/components/ExceptionsBox/create';
import {CompRenderer} from '../../../types/comp';
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

    let controller: ExceptionsBoxController | undefined = createExceptionsBoxController(exceptionsBoxRoot);

    return {
        elements: {
            root: exceptionsBoxRoot,
        },
        actions: {
            displayException: (message: string) => {
                controller?.displayException(message);
            },
        },
        onDestroy: () => {
            controller?.destroy();
            exceptionsBoxRoot.remove();
            controller = undefined;
        },
    };
};
