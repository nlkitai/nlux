import {MarkdownSequenceParsers} from './baseRegexParsers';

const patternsThatCanOpen: string[] = [
    '^\\[$',
    '^\\[[^\\]]+$',
    '^\\[[^\\]]+\\]$',
    '^\\[[^\\]]+\\]\\($',
    '^\\[[^\\]]+\\]\\([^\\)]*$',
];

export const linkParsers: MarkdownSequenceParsers = {
    shouldOpen: /\[([^\]]+)\]\(([^\)]*)\)/,
    canOpen: (str: string) => patternsThatCanOpen.some(ptr => new RegExp(ptr).test(str)),
    shouldClose: () => true,
    canClose: () => false,
};
