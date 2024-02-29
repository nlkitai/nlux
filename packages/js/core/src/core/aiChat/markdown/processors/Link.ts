import {MarkdownElementName} from '../../../../types/markdown/markdownElement';
import {MarkdownProcessorInterface} from '../../../../types/markdown/markdownProcessorInterface';
import {createMarkdownProcessor} from '../markdownProcessorFactory';
import {ProcessorWithChildren} from './baseProcessorWithChildren';

export class LinkProcessor extends ProcessorWithChildren {
    private linkContentProcessed: string = '';

    constructor(
        parent: MarkdownProcessorInterface,
        openingSequence?: string,
        initialContent?: string,
    ) {
        super(
            parent,
            'Link',
            openingSequence ?? null,
            initialContent ?? null,
            null,
        );
    }

    get canExistAtRootLevel(): boolean {
        return false;
    }

    get nestedMarkdownElements(): MarkdownElementName[] | 'all' | 'none' {
        return [
            'BoldAsterisk', 'ItalicAsterisk',
            'BoldUnderscore', 'ItalicUnderscore',
            'Code',
        ];
    }

    get yieldingMarkdownElements(): MarkdownElementName[] | 'none' {
        return [
            'Paragraph',
            'BoldAsterisk', 'ItalicAsterisk',
            'BoldUnderscore', 'ItalicUnderscore',
            `Code`,
        ];
    }

    createElement(openingSequence?: string): HTMLElement {
        const regex = /\[(.*[^\]])\]\((.*[^\)])\)/;
        const match = regex.exec(openingSequence!);

        const link = document.createElement('a');
        link.textContent = '';

        if (match && match.length >= 3 && match[2]) {
            link.href = match[2];
        }

        return link;
    }

    processCharacter(character: string) {
        super.processCharacter(character);
        if (!this.yielded) {
            this.linkContentProcessed += character;
        }
    }

    protected processSequence(lastCharacter: string): {
        sequenceDiscarded: boolean,
        discardedSequence?: string,
        yielded?: boolean,
    } {
        if (!this.initialContent || this.initialContent === this.linkContentProcessed) {
            this.yield(
                undefined,
                lastCharacter,
            );

            return {
                yielded: true,
                sequenceDiscarded: true,
                discardedSequence: lastCharacter,
            };
        }

        this.sequenceParser.appendCharacter(lastCharacter);

        const nestedElementToCreate = this.sequenceParser.nestedElementToCreate;
        if (nestedElementToCreate) {
            createMarkdownProcessor(
                nestedElementToCreate,
                this,
                this.sequenceParser.sequence,
                lastCharacter,
                this.markdownProcessorOptions,
            );

            this.sequenceParser.reset();
            return {sequenceDiscarded: false};
        }

        if (this.sequenceParser.canLeadToClosingOrNewMarkdown) {
            return {sequenceDiscarded: false};
        }

        const sequenceValue = this.sequenceParser.sequence;
        this.sequenceParser.reset();
        return {
            sequenceDiscarded: true,
            discardedSequence: sequenceValue,
        };
    }
}
