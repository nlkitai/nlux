import {createExceptionItemDom} from './create';

const exceptionDisplayTime = 4000;
const exceptionHideAnimationTime = 500;

export type ExceptionsBoxController = {
    displayException: (message: string, ref?: string) => void;
};

export const createExceptionBoxController = (root: HTMLElement): ExceptionsBoxController => {
    const exceptionsQueue = new Set<{
        message: string;
        ref?: string;
    }>();

    let exceptionShown: boolean = false;
    let exceptionItem: HTMLElement | null = null;

    const processExceptionsQueue = () => {
        if (exceptionShown) {
            // If exception is shown, we need to wait for it to hide
            // This method will be called again when it hides
            return;
        }

        if (exceptionsQueue.size === 0) {
            return;
        }

        exceptionShown = true;
        const victim = exceptionsQueue.values().next().value;
        exceptionsQueue.delete(victim);

        exceptionItem = createExceptionItemDom(victim);
        root.append(exceptionItem);
        setTimeout(hideException, exceptionDisplayTime);
    };

    const hideException = () => {
        exceptionItem?.classList.add('nlux-comp-exp_itm_hide');

        // Wait for animation to finish
        setTimeout(() => {
            exceptionShown = false;
            exceptionItem?.remove();
            exceptionItem = null;

            // Process next exception
            processExceptionsQueue();
        }, exceptionHideAnimationTime);
    };

    return {
        displayException: (message: string, ref?: string) => {
            exceptionsQueue.add({message, ref});
            if (!exceptionShown) {
                processExceptionsQueue();
            }
        },
    };
};
