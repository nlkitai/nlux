import {NluxRenderingError} from '../../exports/error';

const source = 'dom/listenTo';

export type ListenToBuilder = {
    on: (eventName: string, callback?: Function | undefined) => ListenToBuilder;
    get: () => [HTMLElement, () => void];
};

export const listenToElement = (element: HTMLElement, query?: string): ListenToBuilder => {
    let used = false;

    const queryResult = query ? element.querySelector(query) : element;
    const elementToReturn = queryResult instanceof HTMLElement ? queryResult : undefined;

    if (!elementToReturn) {
        throw new NluxRenderingError({
            source,
            message: `Could not find element with query "${query}". ` +
                'Make sure the query provided matches an element that exists in the root element.',
        });
    }

    const domListeners = new Map<string, (event: Event) => void>();
    const userCallbacks = new Map<string, Set<Function>>();

    const removeListeners = () => {
        if (!elementToReturn) {
            return;
        }

        domListeners.forEach((callback, eventName) => {
            elementToReturn.removeEventListener(eventName, callback);
        });

        domListeners.clear();
        userCallbacks.clear();
    };

    const result: ListenToBuilder = {
        on: (eventName: string, callback?: Function | undefined): ListenToBuilder => {
            if (!callback || !elementToReturn) {
                return result;
            }

            // Register native DOM callback for event
            // This is the actual callback that should be removed during cleanup
            if (!domListeners.has(eventName)) {
                const onEvent = (event: Event) => {
                    userCallbacks.get(eventName)?.forEach(callback => callback(event));
                };

                domListeners.set(eventName, onEvent);
                elementToReturn.addEventListener(eventName, onEvent);
            }

            // Set user-defined callbacks for event
            if (!userCallbacks.has(eventName)) {
                userCallbacks.set(eventName, new Set());
            }

            // Add user-defined callback to set
            const callbacksForEvent = userCallbacks.get(eventName)!;
            callbacksForEvent.add(callback);

            return result;
        },
        get: () => {
            if (used) {
                throw new Error('listenTo().get() can only be used once!');
            }

            used = true;
            return [elementToReturn, removeListeners];
        },
    };

    return result;
};
