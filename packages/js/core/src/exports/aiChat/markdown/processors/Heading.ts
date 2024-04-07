import {MarkdownElementName} from '../../../../types/markdown/markdownElement';
import {MarkdownProcessorInterface} from '../../../../types/markdown/markdownProcessorInterface';
import {ProcessorWithChildren} from './baseProcessorWithChildren';

export class HeadingProcessor extends ProcessorWithChildren {
    private __headingLevel: 1 | 2 | 3 | 4 | 5 | 6;

    constructor(
        headingLevel: 1 | 2 | 3 | 4 | 5 | 6,
        parent: MarkdownProcessorInterface,
        openSequence?: string,
        initialContent?: string,
    ) {
        super(
            parent,
            headingNameFromLevel(headingLevel),
            openSequence ?? null,
            initialContent ?? null,
            null,
        );

        this.__headingLevel = headingLevel;
    }

    get canExistAtRootLevel(): boolean {
        return true;
    }

    get nestedMarkdownElements(): MarkdownElementName[] | 'all' | 'none' {
        return [
            'BoldAsterisk', 'ItalicAsterisk',
            'BoldUnderscore', 'ItalicUnderscore',
            `Code`,
            'Link',
        ];
    }

    get yieldingMarkdownElements(): MarkdownElementName[] | 'none' {
        return 'none';
    }

    createElement(): HTMLElement {
        return document.createElement('h' + this.__headingLevel);
    }

    processCharacter(character: string): void {
        this.preProcessCharacter(character);

        if (this.parsingChild) {
            this.parsingChild.processCharacter(character);
            return;
        }

        const {
            sequenceDiscarded,
            discardedSequence,
            yielded,
        } = this.processSequence(character);

        if (yielded) {
            return;
        }

        if (sequenceDiscarded && discardedSequence) {
            if (!/^\s+$/.test(discardedSequence)) {
                this.domElement?.append(discardedSequence);
            }
        }
    }
}

export const headingNameFromLevel = (level: 1 | 2 | 3 | 4 | 5 | 6): MarkdownElementName => {
    switch (level) {
        case 1:
            return 'Heading1';
        case 2:
            return 'Heading2';
        case 3:
            return 'Heading3';
        case 4:
            return 'Heading4';
        case 5:
            return 'Heading5';
        case 6:
            return 'Heading6';
    }
};
