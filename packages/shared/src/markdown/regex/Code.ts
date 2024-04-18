import {MarkdownSequenceParsers} from './baseRegexParsers';

export const codeParsers: MarkdownSequenceParsers = {
    shouldOpen: /^`[^`]$/,
    canOpen: /^`$/,
    shouldClose: /^`[\s\S]+$/,
    canClose: /^`$/,
};
