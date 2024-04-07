import {MarkdownElementName} from '../../../../types/markdown/markdownElement';
import {MarkdownProcessorInterface} from '../../../../types/markdown/markdownProcessorInterface';
import {isLineBreakSequence} from '../../../../utils/character/isLineBreakSequence';
import {createMarkdownProcessor} from '../markdownProcessorFactory';
import {BaseMarkdownProcessor, MarkdownProcessorOptions} from './baseProcessor';

export abstract class ProcessorWithChildren extends BaseMarkdownProcessor {
    constructor(
        parent: MarkdownProcessorInterface,
        elementName: MarkdownElementName,
        openingSequence: string | null,
        initialContent: string | null,
        options: MarkdownProcessorOptions | null,
    ) {
        super(
            parent,
            elementName,
            openingSequence,
            initialContent,
            options,
        );
    }

    abstract get canExistAtRootLevel(): boolean;

    abstract get nestedMarkdownElements(): MarkdownElementName[] | 'all' | 'none';

    abstract get yieldingMarkdownElements(): MarkdownElementName[] | 'none';

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

    abstract createElement(openingSequence?: string): HTMLElement;

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

        // Append line break if needed
        if (
            isLineBreakSequence(this.last3Characters) &&
            (
                this.nestedMarkdownElements.includes('LineBreak') ||
                this.nestedMarkdownElements === 'all'
            )
        ) {
            // Trim spaces inside before creating line break
            if (this.domElement?.innerHTML) {
                this.domElement.innerHTML = this.domElement?.innerHTML.trim();
            }

            this.createAndAppendMarkdown('LineBreak');
            this.sequenceParser.reset();
        } else {
            if (sequenceDiscarded) {
                // No sequence was found, we need to check if the character can start a new sequence!
                this.resetSequenceParser();
                const secondCheck = this.processSequence(character);
                if (secondCheck.sequenceDiscarded) {
                    this.sequenceParser.reset();

                    // We append the entire discarded sequence
                    if (discardedSequence) {
                        this.domElement?.append(discardedSequence);
                    }
                } else {
                    // Since the character is being used in new sequence, we need to exclude it
                    // from the discarded sequence to append to the DOM
                    if (discardedSequence && discardedSequence.length > 1) {
                        this.domElement?.append(discardedSequence.slice(0, -1));
                    }
                }
            }
        }
    }

    protected processSequence(lastCharacter: string): {
        sequenceDiscarded: boolean,
        discardedSequence?: string,
        yielded?: boolean,
    } {
        this.sequenceParser.appendCharacter(lastCharacter);

        if (this.sequenceParser.shouldCloseCurrentMarkdown) {
            this.yield(undefined, lastCharacter);
            return {sequenceDiscarded: false, yielded: true};
        }

        if (this.sequenceParser.elementToCreateAtParentLevel) {
            this.yield(
                this.sequenceParser.elementToCreateAtParentLevel,
                lastCharacter,
            );

            return {sequenceDiscarded: false, yielded: true};
        }

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
