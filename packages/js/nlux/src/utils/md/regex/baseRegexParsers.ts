import {MarkdownElementName} from '../../../types/markdown/markdownElement';
import {BoldAsterisk, BoldUnderscore, ItalicAsterisk, ItalicUnderscore} from './BoldItalic';
import {codeParsers} from './Code';
import {codeBlockParsers} from './CodeBlock';
import {
    Heading1Parsers,
    Heading2Parsers,
    Heading3Parsers,
    Heading4Parsers,
    Heading5Parsers,
    Heading6Parsers,
} from './Heading';
import {LineBreakParsers} from './LineBreak';

type SequenceParsingFunction = RegExp | ((sequence: string) => boolean);

export type MarkdownSequenceParsers = {
    canOpen: SequenceParsingFunction,
    shouldOpen: SequenceParsingFunction,
    canClose: SequenceParsingFunction,
    shouldClose: SequenceParsingFunction,
};

export const checkSequence = (
    markdownElement: MarkdownElementName,
    checkType: keyof MarkdownSequenceParsers,
) => (sequence: string): boolean => {
    const parsers = parsersByMarkdownElementName.get(markdownElement);
    if (!parsers) {
        throw new Error(`No sequence parsers found for markdown element ${markdownElement}`);
    }

    const parser = parsers[checkType];
    if (parser instanceof RegExp) {
        return parser.test(sequence);
    }

    return parser(sequence);
};

export const parsersByMarkdownElementName = new Map<MarkdownElementName, MarkdownSequenceParsers>;

parsersByMarkdownElementName.set('Code', codeParsers);
parsersByMarkdownElementName.set('CodeBlock', codeBlockParsers);

parsersByMarkdownElementName.set('Heading1', Heading1Parsers);
parsersByMarkdownElementName.set('Heading2', Heading2Parsers);
parsersByMarkdownElementName.set('Heading3', Heading3Parsers);
parsersByMarkdownElementName.set('Heading4', Heading4Parsers);
parsersByMarkdownElementName.set('Heading5', Heading5Parsers);
parsersByMarkdownElementName.set('Heading6', Heading6Parsers);

parsersByMarkdownElementName.set('BoldAsterisk', BoldAsterisk);
parsersByMarkdownElementName.set('BoldUnderscore', BoldUnderscore);
parsersByMarkdownElementName.set('ItalicAsterisk', ItalicAsterisk);
parsersByMarkdownElementName.set('ItalicUnderscore', ItalicUnderscore);

parsersByMarkdownElementName.set('LineBreak', LineBreakParsers);

// TODO - Same as above, but for all markdown elements

parsersByMarkdownElementName.set('Root', {
    canOpen: () => false,
    shouldOpen: () => false,
    canClose: () => false,
    shouldClose: () => false,
});

parsersByMarkdownElementName.set('Paragraph', {
    canOpen: /^\n+$/,
    shouldOpen: /^\n{2,}$/,
    canClose: /^\n$/,
    shouldClose: /^\n{2,}$/,
});

parsersByMarkdownElementName.set('Blockquote', {
    shouldOpen: /^$/,
    canOpen: /^>$/,
    shouldClose: /^$/,
    canClose: /^$/,
});

parsersByMarkdownElementName.set('OrderedList', {
    shouldOpen: /^$/,
    canOpen: /^\d+\. $/,
    shouldClose: /^\n$/,
    canClose: /^\n$/,
});

parsersByMarkdownElementName.set('UnorderedList', {
    shouldOpen: /^$/,
    canOpen: /^\* $/,
    shouldClose: /^\n$/,
    canClose: /^\n$/,
});

parsersByMarkdownElementName.set('HorizontalRule', {
    shouldOpen: /^$/,
    canOpen: /^---$/,
    shouldClose: /^$/,
    canClose: /^$/,
});

parsersByMarkdownElementName.set('Link', {
    shouldOpen: /^$/,
    canOpen: /^\[.*\]\(.*\)$/,
    shouldClose: /^$/,
    canClose: /^$/,
});

parsersByMarkdownElementName.set('Image', {
    shouldOpen: /^$/,
    canOpen: /^!\[.*\]\(.*\)$/,
    shouldClose: /^$/,
    canClose: /^$/,
});

