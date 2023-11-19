import {MarkdownSequenceParsers} from './baseRegexParsers';

export const BoldAsterisk: MarkdownSequenceParsers = {
    canOpen: /^\*{1,2}$/,
    shouldOpen: /^\*{2}[^(\s\n)]$/,
    canClose: /^\*{1,2}$/,
    shouldClose: /^\*{2}[\s\S]$/,
};

export const BoldUnderscore: MarkdownSequenceParsers = {
    canOpen: /^_{1,2}$/,
    shouldOpen: /^_{2}[^(\s\n)]$/,
    canClose: /^_{1,2}$/,
    shouldClose: /^_{2}[\s\S]$/,
};

export const ItalicAsterisk: MarkdownSequenceParsers = {
    canOpen: /^\*$/,
    shouldOpen: /^\*[^(\*\s\n)]$/,
    canClose: /^\*$/,
    shouldClose: /^\*[\s\S]$/,
};

export const ItalicUnderscore: MarkdownSequenceParsers = {
    canOpen: /^_$/,
    shouldOpen: /^_[^(_\s\n)]$/,
    canClose: /^_$/,
    shouldClose: /^_[\s\S]$/,
};
