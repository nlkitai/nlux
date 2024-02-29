import {MarkdownSequenceParsers} from './baseRegexParsers';

export const codeBlockParsers: MarkdownSequenceParsers = {
    shouldOpen: /^```.*\n$/,
    canOpen: /^`{1,3}.*$/,
    shouldClose: /^\n?```[\s\S]+$/,
    canClose: /^\n$|^\n?`{1,3}$/,
};
