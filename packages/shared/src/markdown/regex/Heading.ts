import {MarkdownSequenceParsers} from './baseRegexParsers';

export const Heading1Parsers: MarkdownSequenceParsers = {
    shouldOpen: /^\n*#{1} $/,
    canOpen: /^\n*#*$/,
    shouldClose: /^\n$/,
    canClose: () => false,
};

export const Heading2Parsers: MarkdownSequenceParsers = {
    shouldOpen: /^\n*#{2} +$/,
    canOpen: /^\n*#*$/,
    shouldClose: /^\n$/,
    canClose: () => false,
};

export const Heading3Parsers: MarkdownSequenceParsers = {
    shouldOpen: /^\n*#{3} +$/,
    canOpen: /^\n*#*$/,
    shouldClose: /^\n$/,
    canClose: () => false,
};

export const Heading4Parsers: MarkdownSequenceParsers = {
    shouldOpen: /^\n*#{4} +$/,
    canOpen: /^\n*#*$/,
    shouldClose: /^\n$/,
    canClose: () => false,
};

export const Heading5Parsers: MarkdownSequenceParsers = {
    shouldOpen: /^\n*#{5} +$/,
    canOpen: /^\n*#*$/,
    shouldClose: /^\n$/,
    canClose: () => false,
};

export const Heading6Parsers: MarkdownSequenceParsers = {
    shouldOpen: /^\n*#{6} +$/,
    canOpen: /^\n*#*$/,
    shouldClose: /^\n$/,
    canClose: () => false,
};

