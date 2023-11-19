import {MarkdownElementName} from '../../../types/markdown/markdownElement';
import {MarkdownProcessorInterface} from '../../../types/markdown/markdownProcessorInterface';
import {ProcessorWithChildren} from './baseProcessorWithChildren';

export class ItalicUnderscoreProcessor extends ProcessorWithChildren {
    constructor(
        parent: MarkdownProcessorInterface,
        initialContent?: string,
    ) {
        super(
            parent,
            'ItalicUnderscore',
            initialContent,
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
        ];
    }

    get yieldingMarkdownElements(): MarkdownElementName[] | 'none' {
        return 'none';
    }

    createElement(): HTMLElement {
        return document.createElement('em');
    }
}
