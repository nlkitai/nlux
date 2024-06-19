/**
 * A type representing a function to use as HTML sanitizer.
 * This type can be passed to markdown parser, to be used to sanitize generated
 * HTML before appending it to the document.
 */
export type SanitizerExtension = (html: string) => string;
