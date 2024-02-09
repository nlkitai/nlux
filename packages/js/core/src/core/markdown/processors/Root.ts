import {MarkdownElementName} from '../../../types/markdown/markdownElement';
import {isLineBreakSequence} from '../../../x/character/isLineBreakSequence';
import {isWhitespaceOrNewLine} from '../../../x/character/isWhitespaceOrNewLine';
import {isBr} from '../../../x/dom/isBr';
import {createMarkdownProcessor} from '../markdownProcessorFactory';
import {BaseMarkdownProcessor, MarkdownProcessorOptions} from './baseProcessor';

export class RootProcessor extends BaseMarkdownProcessor {
    private __rootDomElement: HTMLElement | undefined;

    constructor(
        rootDomElement: HTMLElement,
        openingSequence?: string,
        options?: MarkdownProcessorOptions,
    ) {
        super(
            null,
            'Root',
            openingSequence ?? null,
            null,
            options ?? null,
        );

        this.__rootDomElement = rootDomElement;
    }

    get canExistAtRootLevel(): boolean {
        return false;
    }

    // We override the getter for the domElement, since the root element is not created by the parser.
    get domElement(): HTMLElement | undefined {
        return this.__rootDomElement;
    }

    get nestedMarkdownElements(): MarkdownElementName[] | 'all' | 'none' {
        return 'all';
    }

    get yieldingMarkdownElements(): MarkdownElementName[] | 'none' {
        return 'none';
    }

    public complete() {
        if (this.parsingChild) {
            this.parsingChild.purgeSequence();
        }

        this.purgeSequence();

        // Remove trailing <br /> at the root level
        if (isBr(this.domElement?.lastChild)) {
            this.domElement?.lastChild?.remove();
        }
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
        throw new Error('Root cannot create an element');
    }

    processCharacter(character: string): void {
        this.preProcessCharacter(character);

        if (this.parsingChild) {
            this.parsingChild.processCharacter(character);
            return;
        }

        this.sequenceParser.appendCharacter(character);
        this.processSequence(character);
    }

    yield() {
        super.yield();
        this.__rootDomElement = undefined;
    }

    private processSequence(lastCharacter?: string) {
        if (this.sequenceParser.shouldCloseCurrentMarkdown) {
            // Nothing is supposed to close the root element.
            return;
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

            const parsingChild = this.parsingChild;
            if (parsingChild && !parsingChild.canExistAtRootLevel) {
                createMarkdownProcessor(
                    'Paragraph',
                    this,
                );

                this.parsingChild?.setParsingChild(parsingChild);
            }

            this.sequenceParser.reset();
            return;
        }

        if (this.sequenceParser.canLeadToClosingOrNewMarkdown) {
            // Do nothing, we're waiting for more characters.
            return;
        }

        // If we're here, it means that the sequence is not supposed to yield a new markdown element.

        // First we check for <br />
        if (isLineBreakSequence(this.last3Characters)) {
            this.createAndAppendMarkdown('LineBreak');
            return;
        }

        // If nothing, we simply wrap the sequence in a paragraph
        if (lastCharacter && !isWhitespaceOrNewLine(lastCharacter)) {
            createMarkdownProcessor(
                'Paragraph',
                this,
                undefined,
                this.sequenceParser.sequence,
            );

            this.sequenceParser.reset();
        }
    }
}
