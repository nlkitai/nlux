import {MarkdownElementName} from '../../../types/markdown/markdownElement';
import {MarkdownProcessorInterface} from '../../../types/markdown/markdownProcessorInterface';
import {createMarkdownProcessor} from '../markdownProcessorFactory';
import {BaseMarkdownProcessor} from './baseProcessor';

export class LineBreakProcessor extends BaseMarkdownProcessor {
    constructor(
        parent: MarkdownProcessorInterface,
        openingSequence?: string,
        initialContent?: string,
    ) {
        super(
            parent,
            'LineBreak',
            openingSequence ?? null,
            initialContent ?? null,
            null,
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

    createAndAppendMarkdown(elementName: MarkdownElementName, openingSequence?: string): void {
        createMarkdownProcessor(
            elementName,
            this,
            openingSequence,
            undefined,
            this.markdownProcessorOptions,
        );

        this.sequenceParser.reset();
    }

    createElement(): HTMLElement {
        return document.createElement('br');
    }

    init() {
        super.init();
    }

    processCharacter(character: string): void {
        this.yield(
            undefined,
            character,
        );
    }
}
