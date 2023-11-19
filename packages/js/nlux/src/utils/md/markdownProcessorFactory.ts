import {MarkdownElementName} from '../../types/markdown/markdownElement';
import {MarkdownProcessorInterface} from '../../types/markdown/markdownProcessorInterface';
import {BoldAsteriskProcessor} from './processors/BoldAsterisk';
import {BoldUnderscoreProcessor} from './processors/BoldUnderscore';
import {CodeProcessor} from './processors/Code';
import {CodeBlock} from './processors/CodeBlock';
import {HeadingProcessor} from './processors/Heading';
import {ItalicAsteriskProcessor} from './processors/ItalicAsterisk';
import {ItalicUnderscoreProcessor} from './processors/ItalicUnderscore';
import {LineBreakProcessor} from './processors/LineBreak';
import {ParagraphProcessor} from './processors/Paragraph';

export const createMarkdownProcessor = (
    markdownElementName: MarkdownElementName,
    parent: MarkdownProcessorInterface,
    initialContent?: string,
): void => {
    if (markdownElementName === 'Paragraph') {
        const newParagraph = new ParagraphProcessor(
            parent,
            initialContent,
        );

        newParagraph.init();
        parent.setParsingChild(newParagraph);
        return;
    }

    if (markdownElementName === 'LineBreak') {
        const newLineBreak = new LineBreakProcessor(
            parent,
            initialContent,
        );

        newLineBreak.init();
        parent.setParsingChild(newLineBreak);
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
            initialContent,
        );

        newHeading.init();
        parent.setParsingChild(newHeading);
        return;
    }

    if (markdownElementName === 'Code') {
        const newCode = new CodeProcessor(
            parent,
            initialContent,
        );

        newCode.init();
        parent.setParsingChild(newCode);
        return;
    }

    if (markdownElementName === 'CodeBlock') {
        const newCode = new CodeBlock(
            parent,
            initialContent,
        );

        newCode.init();
        parent.setParsingChild(newCode);
        return;
    }

    if (markdownElementName === 'BoldAsterisk') {
        const newBold = new BoldAsteriskProcessor(
            parent,
            initialContent,
        );

        newBold.init();
        parent.setParsingChild(newBold);
        return;
    }

    if (markdownElementName === 'BoldUnderscore') {
        const newBold = new BoldUnderscoreProcessor(
            parent,
            initialContent,
        );

        newBold.init();
        parent.setParsingChild(newBold);
        return;
    }

    if (markdownElementName === 'ItalicAsterisk') {
        const newItalic = new ItalicAsteriskProcessor(
            parent,
            initialContent,
        );

        newItalic.init();
        parent.setParsingChild(newItalic);
        return;
    }

    if (markdownElementName === 'ItalicUnderscore') {
        const newItalic = new ItalicUnderscoreProcessor(
            parent,
            initialContent,
        );

        newItalic.init();
        parent.setParsingChild(newItalic);
        return;
    }

    throw new Error('Unable to create child processor for markdown element ' + markdownElementName);
};
