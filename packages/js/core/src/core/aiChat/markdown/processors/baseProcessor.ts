import {MarkdownElementName} from '../../../../types/markdown/markdownElement';
import {MarkdownProcessorInterface} from '../../../../types/markdown/markdownProcessorInterface';
import {HighlighterExtension} from '../../highlighter/highlighter';
import {SequenceParser} from '../sequenceParser';

export type MarkdownProcessorOptions = {
    syntaxHighlighter?: HighlighterExtension;
    skipCopyToClipboardButton?: boolean;
    openLinksInNewWindow?: boolean;
};

export abstract class BaseMarkdownProcessor implements MarkdownProcessorInterface {

    protected __parent: MarkdownProcessorInterface | undefined;
    private __element: HTMLElement | undefined;
    private readonly __initialContent: string | undefined;
    private __initialized: boolean = false;
    private __last3Characters: string = '';
    private readonly __markdownElementName: MarkdownElementName;
    private readonly __openingSequence?: string;
    private readonly __options: MarkdownProcessorOptions = {};
    private __parsingChild: MarkdownProcessorInterface | undefined;
    private __sequenceParser: SequenceParser | undefined;
    private __yielded: boolean = false;

    protected constructor(
        parent: MarkdownProcessorInterface | null,
        elementName: MarkdownElementName,
        openingSequence: string | null,
        initialContent: string | null,
        options: MarkdownProcessorOptions | null,
    ) {
        this.__markdownElementName = elementName;
        this.__parent = parent ?? undefined;
        this.__options = options || {};
        this.__openingSequence = openingSequence ?? undefined;

        if (elementName !== 'Root') {
            this.__initialContent = initialContent ?? undefined;
        } else {
            this.__initialContent = undefined;
        }
    }

    abstract get canExistAtRootLevel(): boolean;

    public get domElement(): HTMLElement | undefined {
        return this.__element;
    }

    public get markdownElementName(): MarkdownElementName {
        return this.__markdownElementName;
    }

    // Markdown elements that when detected inside the current markdown element, should be nested
    abstract get nestedMarkdownElements(): MarkdownElementName[] | 'all' | 'none';

    public get parsingChild(): MarkdownProcessorInterface | undefined {
        return this.__parsingChild;
    }

    get removeWhenEmpty(): boolean {
        return false;
    }

    public get sequenceParser(): SequenceParser {
        if (this.yielded) {
            throw new Error('Cannot access sequence parser of a yielded processor');
        }

        if (!this.__sequenceParser) {
            this.__sequenceParser = new SequenceParser(
                this.__markdownElementName,
                this.nestedMarkdownElements,
                this.yieldingMarkdownElements,
            );
        }

        return this.__sequenceParser;
    }

    public get yielded(): boolean {
        return this.__yielded;
    }

    /**
     * Markdown elements that when detected inside the current markdown element, should trigger yielding
     * @returns {MarkdownElementName[] | 'none'}
     */
    abstract get yieldingMarkdownElements(): MarkdownElementName[] | 'none';

    protected get initialContent(): string | undefined {
        return this.__initialContent;
    }

    protected get last3Characters(): string {
        return this.__last3Characters;
    }

    protected get markdownProcessorOptions(): Readonly<MarkdownProcessorOptions> {
        return this.__options;
    }

    protected get syntaxHighlighter(): HighlighterExtension | undefined {
        return this.__options.syntaxHighlighter;
    }

    /**
     * Create a nested markdown element and append it to the current markdown element
     * Used when a child element yields a markdown element to its parent
     * Example: When # header is detected inside a paragraph, the paragraph should yield and the header should be
     * @param {MarkdownElementName} elementName
     * @param {string} openingSequence
     */
    abstract createAndAppendMarkdown(elementName: MarkdownElementName, openingSequence?: string): void;

    /**
     * Create the DOM element that will be used to render the markdown element
     * @returns {HTMLElement}
     */
    abstract createElement(openingSequence?: string): HTMLElement;

    // It should be called after construction and before processing any characters or attaching to the parent element
    public init(): void {
        if (this.__initialized) {
            return;
        }

        this.__initialized = true;

        if (this.__markdownElementName !== 'Root') {
            this.__element = this.createElement(this.__openingSequence);
        } else {
            this.__element = undefined;
        }

        if (this.__initialContent) {
            for (let i = 0; i < this.__initialContent.length; i++) {
                const character = this.__initialContent[i];
                this.processCharacter(character);
            }
        }
    }

    /**
     * This is called to handle the case when a child element yields to its parent:
     * - Either because the child element has finished parsing
     * - Or because it has detected a nested markdown element that should rather be parsed by the parent.
     *
     * @param {MarkdownProcessorInterface} child
     * @param {MarkdownElementName} elementToCreateAtParentLevel
     * @param {string} openingSequence
     * @param {string} characterToAppendToParentLevel
     */
    public parsingChildYielded(
        child: MarkdownProcessorInterface,
        elementToCreateAtParentLevel?: MarkdownElementName,
        openingSequence?: string,
        characterToAppendToParentLevel?: string,
    ): void {
        if (this.__parsingChild === child) {
            this.__parsingChild = undefined;
        }

        if (elementToCreateAtParentLevel) {
            this.createAndAppendMarkdown(
                elementToCreateAtParentLevel,
                openingSequence,
            );
        }

        if (characterToAppendToParentLevel) {
            this.processCharacter(characterToAppendToParentLevel);
        }
    }

    /**
     * It should be called as soon as a character is detected, before processing it.
     * It is used to keep track of the last 3 characters, which is useful to detect certain sequences.
     * @param {string} character
     */
    preProcessCharacter(character: string): void {
        if (this.__last3Characters.length < 3) {
            this.__last3Characters += character;
            return;
        }

        this.__last3Characters = this.__last3Characters.slice(1) + character;
    }

    /**
     * Important method that's called when a character is processed.
     * @param {string} character
     */
    abstract processCharacter(character: string): void;

    /**
     * Called when a sequence does not result in a new markdown element or closing the current markdown element.
     * That sequence should be appended to the DOM
     */
    purgeSequence(): void {
        if (this.__parsingChild) {
            this.__parsingChild.purgeSequence();
        }

        if (this.__sequenceParser?.sequence) {
            this.__element?.append(this.__sequenceParser.sequence);
            this.__sequenceParser.reset();
        }
    }

    public resetSequenceParser(): void {
        this.__sequenceParser?.reset();
        this.__sequenceParser = new SequenceParser(
            this.__markdownElementName,
            this.nestedMarkdownElements,
            this.yieldingMarkdownElements,
        );
    }

    /**
     * Called when a sequence results in a new markdown element and a new Markdown processor is created as a child
     * An element should only have one parsing child at a time - except for the root element that can toggle between
     * multiple parsing children (example: when # header is detected inside a paragraph, the paragraph should yield and
     * the root element should create a header element and append it to itself as a parsing child to replace the
     * paragraph).
     *
     * @param {MarkdownProcessorInterface} child
     */
    public setParsingChild(child: MarkdownProcessorInterface): void {
        if (this.__parsingChild && this.__markdownElementName !== 'Root') {
            throw new Error('Cannot set spawn child while parsing child');
        }

        this.__parsingChild = child;
        if (child.domElement) {
            this.domElement?.append(child.domElement);
        }

        (child as BaseMarkdownProcessor).__parent = this;
    }

    /**
     * Called when a sequence results in closing the current markdown element or when a new markdown element should be
     * created at the parent level.
     * It marks the current element as yielded and removes the reference to the parent element,
     * and calls parsingChildYielded() on the parent element to notify it that the current element has yielded.
     *
     * @param {MarkdownElementName} elementToCreateAtParentLevel
     * @param {string} characterToAppendToParent
     */
    public yield(
        elementToCreateAtParentLevel?: MarkdownElementName,
        characterToAppendToParent?: string,
    ): void | never {
        if (this.yielded) {
            return;
        }

        const openingSequence = (
            this.__sequenceParser && !this.__sequenceParser?.shouldCloseCurrentMarkdown
        ) ? this.__sequenceParser?.sequence : undefined;

        this.__yielded = true;
        this.__sequenceParser = undefined;

        if (this.__parsingChild) {
            this.__parsingChild.yield();
            this.__parsingChild = undefined;
        }

        if (this.__element) {
            this.__element.innerHTML = this.__element.innerHTML.trim();
            if (this.removeWhenEmpty && this.__element.innerHTML === '') {
                this.__element.remove();
            }

            this.__element = undefined;
        }

        if (this.__parent) {
            this.__parent.parsingChildYielded(
                this,
                elementToCreateAtParentLevel,
                openingSequence,
                characterToAppendToParent,
            );
            this.__parent = undefined;
        }
    }
}
