import {MarkdownElementName} from '../../../types/markdown/markdownElement';
import {MarkdownProcessorInterface} from '../../../types/markdown/markdownProcessorInterface';
import {MarkdownProcessorOptions} from './baseProcessor';
import {ProcessorWithChildren} from './baseProcessorWithChildren';

export class CodeProcessor extends ProcessorWithChildren {
    constructor(
        parent: MarkdownProcessorInterface,
        openingSequence?: string,
        initialContent?: string,
        options?: MarkdownProcessorOptions,
    ) {
        super(
            parent,
            'Code',
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
            'BoldAsterisk', 'ItalicAsterisk',
            'BoldUnderscore', 'ItalicUnderscore',
        ];
    }

    get yieldingMarkdownElements(): MarkdownElementName[] | 'none' {
        return 'none';
    }

    createElement(): HTMLElement {
        return document.createElement('code');
    }
}
