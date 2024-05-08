import {MarkdownElementName} from '../../../types/markdown/markdownElement';
import {MarkdownProcessorInterface} from '../../../types/markdown/markdownProcessorInterface';
import {MarkdownProcessorOptions} from './baseProcessor';
import {ProcessorWithChildren} from './baseProcessorWithChildren';

export class ItalicUnderscoreProcessor extends ProcessorWithChildren {
    constructor(
        parent: MarkdownProcessorInterface,
        openingSequence?: string,
        initialContent?: string,
        options?: MarkdownProcessorOptions,
    ) {
        super(
            parent,
            'ItalicUnderscore',
            openingSequence ?? null,
            initialContent ?? null,
            options ?? null,
        );
    }

    get canExistAtRootLevel(): boolean {
        return false;
    }

    get nestedMarkdownElements(): MarkdownElementName[] | 'all' | 'none' {
        return [
            'LineBreak',
            'BoldAsterisk', 'ItalicAsterisk',
            'BoldUnderscore', 'ItalicUnderscore',
            'Code',
            'Link',
        ];
    }

    get yieldingMarkdownElements(): MarkdownElementName[] | 'none' {
        return 'none';
    }

    createElement(): HTMLElement {
        return document.createElement('em');
    }
}
