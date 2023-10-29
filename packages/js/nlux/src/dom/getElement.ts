import {NluxUsageError, NluxRenderingError} from '../core/error';

const source = 'dom/getElement';

export const getElement = (root: HTMLElement, query: string | undefined): HTMLElement => {
    if (!query) {
        throw new NluxUsageError({
            source,
            message: 'A query string must be provided to getElement()',
        });
    }

    const element = root.querySelector(query);
    if (!element) {
        throw new NluxRenderingError({
            source,
            message: `Could not find element with query "${query}". ` +
                'Make sure the query provided matches an element that exists in the root element.',
        });
    }

    if (!(element instanceof HTMLElement)) {
        throw new NluxRenderingError({
            source,
            message: `Element with query "${query}" is not a valid HTMLElement.`,
        });
    }

    return element;
};
