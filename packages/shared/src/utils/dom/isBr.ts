export const isBr = (element: unknown): boolean => {
    return element instanceof HTMLElement && element.tagName === 'BR';
};
