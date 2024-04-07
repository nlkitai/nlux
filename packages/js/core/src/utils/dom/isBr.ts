export const isBr = (element: any): boolean => {
    return element instanceof HTMLElement && element.tagName === 'BR';
};
