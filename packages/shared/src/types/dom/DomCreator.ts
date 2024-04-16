/**
 * Very simple type for a function that creates a DOM element.
 * This type is used for functions that exist in dom.ts file and that create DOM elements without any logic
 * or event listeners. They are used for initial rendering only, including server-side rendering.
 */
export type DomCreator<T> = (props: T) => HTMLElement;
