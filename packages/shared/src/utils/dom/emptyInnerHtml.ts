export const emptyInnerHtml = (element: HTMLElement): void => {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
};
