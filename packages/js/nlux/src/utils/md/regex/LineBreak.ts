import {MarkdownSequenceParsers} from './baseRegexParsers';

export const LineBreakParsers: MarkdownSequenceParsers = {
    shouldOpen: () => false,
    canOpen: () => false,
    shouldClose: () => false,
    canClose: () => false,
};
