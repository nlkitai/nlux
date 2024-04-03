/**
 * A function that updates a DOM element with new props.
 * The function is used for updating DOM elements that were created by DomCreator functions.
 * It should take into consideration the before and after props and update the DOM element accordingly.
 */
export type DomUpdater<T> = (element: HTMLElement, propsBefore: T, propsAfter: T) => void;
