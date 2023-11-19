import {MarkdownElementName} from '../../../types/markdown/markdownElement';
import {MarkdownProcessorInterface} from '../../../types/markdown/markdownProcessorInterface';
import {isWhitespaceOrNewLine} from '../../../x/character/isWhitespaceOrNewLine';
import {ProcessorWithChildren} from './baseProcessorWithChildren';

export class CodeBlock extends ProcessorWithChildren {
    constructor(
        parent: MarkdownProcessorInterface,
        initialContent?: string,
    ) {
        super(
            parent,
            'CodeBlock',
            !initialContent || isWhitespaceOrNewLine(initialContent) ? undefined : initialContent,
        );
    }

    get canExistAtRootLevel(): boolean {
        return true;
    }

    get nestedMarkdownElements(): MarkdownElementName[] | 'all' | 'none' {
        return 'none';
    }

    get yieldingMarkdownElements(): MarkdownElementName[] | 'none' {
        return 'none';
    }

    createElement(): HTMLElement {
        return document.createElement('pre');
    }
}
