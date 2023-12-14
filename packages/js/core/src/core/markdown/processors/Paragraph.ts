import {MarkdownElementName} from '../../../types/markdown/markdownElement';
import {MarkdownProcessorInterface} from '../../../types/markdown/markdownProcessorInterface';
import {ProcessorWithChildren} from './baseProcessorWithChildren';

export class ParagraphProcessor extends ProcessorWithChildren {
    constructor(
        parent: MarkdownProcessorInterface,
        openingSequence?: string,
        initialContent?: string,
    ) {
        super(
            parent,
            'Paragraph',
            openingSequence ?? null,
            initialContent ?? null,
            null,
        );
    }

    get canExistAtRootLevel(): boolean {
        return true;
    }

    get nestedMarkdownElements(): MarkdownElementName[] | 'all' | 'none' {
        return [
            'LineBreak', 'Blockquote',
            'BoldAsterisk', 'ItalicAsterisk',
            'BoldUnderscore', 'ItalicUnderscore',
            'Code', 'Link',
        ];
    }

    get removeWhenEmpty(): boolean {
        return true;
    }

    get yieldingMarkdownElements(): MarkdownElementName[] | 'none' {
        return [
            'Heading1', 'Heading2', 'Heading3', 'Heading4', 'Heading5', 'Heading6',
            'CodeBlock', 'UnorderedList', 'OrderedList', 'HorizontalRule',
            'Image',
        ];
    }

    createElement(): HTMLElement {
        return document.createElement('p');
    }
}
