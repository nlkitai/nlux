import {createExceptionItemDom} from './create';

const exceptionDisplayTime = 3000;
const exceptionHideAnimationTime = 500;

export type ExceptionsBoxController = {
    displayException: (message: string, ref?: string) => void;
    destroy: () => void;
};

export const createExceptionsBoxController = (root: HTMLElement): ExceptionsBoxController => {
    const exceptionsQueue = new Set<{message: string}>();

    let exceptionShown: boolean = false;
    let exceptionItem: HTMLElement | null = null;
    let timeout: ReturnType<typeof setTimeout> | null = null;

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
        timeout = setTimeout(hideException, exceptionDisplayTime);
    };

    const hideException = () => {
        exceptionItem?.classList.add('nlux-comp-exceptionItem--hiding');

        // Wait for animation to finish
        timeout = setTimeout(() => {
            exceptionShown = false;
            exceptionItem?.remove();
            exceptionItem = null;

            // Process next exception
            processExceptionsQueue();
        }, exceptionHideAnimationTime);
    };

    return {
        displayException: (message: string) => {
            exceptionsQueue.add({message});
            if (!exceptionShown) {
                processExceptionsQueue();
            }
        },
        destroy: () => {
            exceptionsQueue.clear();
            exceptionItem?.remove();
            if (timeout) {
                clearTimeout(timeout);
            }
        },
    };
};
