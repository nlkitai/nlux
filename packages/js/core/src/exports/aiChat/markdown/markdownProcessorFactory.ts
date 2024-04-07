import {MarkdownElementName} from '../../../types/markdown/markdownElement';
import {MarkdownProcessorInterface} from '../../../types/markdown/markdownProcessorInterface';
import {MarkdownProcessorOptions} from './processors/baseProcessor';
import {BoldAsteriskProcessor} from './processors/BoldAsterisk';
import {BoldUnderscoreProcessor} from './processors/BoldUnderscore';
import {CodeProcessor} from './processors/Code';
import {CodeBlock} from './processors/CodeBlock';
import {HeadingProcessor} from './processors/Heading';
import {ItalicAsteriskProcessor} from './processors/ItalicAsterisk';
import {ItalicUnderscoreProcessor} from './processors/ItalicUnderscore';
import {LineBreakProcessor} from './processors/LineBreak';
import {LinkProcessor} from './processors/Link';
import {ParagraphProcessor} from './processors/Paragraph';

export const createMarkdownProcessor = (
    markdownElementName: MarkdownElementName,
    parent: MarkdownProcessorInterface,
    sequence?: string,
    initialContent?: string,
    options?: MarkdownProcessorOptions,
): void => {
    if (markdownElementName === 'Paragraph') {
        const newParagraph = new ParagraphProcessor(
            parent,
            sequence,
            initialContent,
        );

        newParagraph.init();
        parent.setParsingChild(newParagraph);
        return;
    }

    if (markdownElementName === 'LineBreak') {
        const newLineBreak = new LineBreakProcessor(
            parent,
            sequence,
            initialContent,
        );

        newLineBreak.init();
        parent.setParsingChild(newLineBreak);
        return;
    }

    if (markdownElementName === 'Link') {
        const regex = /\[([^\]]+)\]\(([^\)]*)\)/;

        const match = regex.exec(sequence!);
        const initialContent = (match && match.length >= 3) ? match[1] : '';
        const newLink = new LinkProcessor(
            parent,
            sequence,
            initialContent,
            options,
        );

        newLink.init();
        parent.setParsingChild(newLink);
        return;
    }

    if (markdownElementName === 'Heading1' || markdownElementName === 'Heading2' || markdownElementName === 'Heading3'
        || markdownElementName === 'Heading4' || markdownElementName === 'Heading5' || markdownElementName
        === 'Heading6') {
        const headingLevel = parseInt(markdownElementName[markdownElementName.length - 1]);
        if (Number.isNaN(headingLevel) || !Number.isFinite(headingLevel) || headingLevel < 1 || headingLevel > 6) {
            throw new Error('Invalid heading level');
        }

        const newHeading = new HeadingProcessor(
            headingLevel as 1 | 2 | 3 | 4 | 5 | 6,
            parent,
            sequence,
            initialContent,
        );

        newHeading.init();
        parent.setParsingChild(newHeading);
        return;
    }

    if (markdownElementName === 'Code') {
        const newCode = new CodeProcessor(
            parent,
            sequence,
            initialContent,
        );

        newCode.init();
        parent.setParsingChild(newCode);
        return;
    }

    if (markdownElementName === 'CodeBlock') {
        const newCode = new CodeBlock(
            parent,
            sequence,
            initialContent,
            options,
        );

        newCode.init();
        parent.setParsingChild(newCode);
        return;
    }

    if (markdownElementName === 'BoldAsterisk') {
        const newBold = new BoldAsteriskProcessor(
            parent,
            sequence,
            initialContent,
        );

        newBold.init();
        parent.setParsingChild(newBold);
        return;
    }

    if (markdownElementName === 'BoldUnderscore') {
        const newBold = new BoldUnderscoreProcessor(
            parent,
            sequence,
            initialContent,
        );

        newBold.init();
        parent.setParsingChild(newBold);
        return;
    }

    if (markdownElementName === 'ItalicAsterisk') {
        const newItalic = new ItalicAsteriskProcessor(
            parent,
            sequence,
            initialContent,
        );

        newItalic.init();
        parent.setParsingChild(newItalic);
        return;
    }

    if (markdownElementName === 'ItalicUnderscore') {
        const newItalic = new ItalicUnderscoreProcessor(
            parent,
            sequence,
            initialContent,
        );

        newItalic.init();
        parent.setParsingChild(newItalic);
        return;
    }

    throw new Error('Unable to create child processor for markdown element ' + markdownElementName);
};
