import {MarkdownElementName} from '../../../types/markdown/markdownElement';
import {MarkdownProcessorInterface} from '../../../types/markdown/markdownProcessorInterface';
import {createMarkdownProcessor} from '../markdownProcessorFactory';
import {BaseMarkdownProcessor} from './baseProcessor';

export class LineBreakProcessor extends BaseMarkdownProcessor {
    constructor(parent: MarkdownProcessorInterface, initialContent?: string) {
        super(
            parent,
            'LineBreak',
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

    createAndAppendMarkdown(elementName: MarkdownElementName) {
        createMarkdownProcessor(
            elementName,
            this,
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
