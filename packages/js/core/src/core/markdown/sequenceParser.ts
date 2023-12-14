import {MarkdownElementName} from '../../types/markdown/markdownElement';
import {allMarkdownElementNames} from './allMarkdownElementNames';
import {checkSequence} from './regex/baseRegexParsers';

export class SequenceParser {
    private readonly __markdownElement: MarkdownElementName;
    private readonly __possibleNestedMarkdownElements: MarkdownElementName[];
    private readonly __possibleYieldingMarkdownElements: MarkdownElementName[];
    // Potential states, for sequences that are incomplete:
    private __canLeadToClosingMarkdown: boolean = false;
    private __latestSequenceProcessed: boolean = false;
    private __markdownThatShouldBeNested: MarkdownElementName | undefined = undefined;
    // Markdown elements that can be created (nested or rendered at parent level)
    private __markdownThatShouldBeRenderedAtParentLevel: MarkdownElementName | undefined = undefined;
    private __potentialNestedMarkdownElements: MarkdownElementName[] = [];
    private __potentialYieldingMarkdownElements: MarkdownElementName[] = [];
    private __sequence: string = '';
    // Final states, that should lead to end of sequence and change in DOM structure:
    private __shouldCloseCurrentMarkdown: boolean = false;

    constructor(
        markdownElement: MarkdownElementName,
        possibleNestedMarkdownElements: MarkdownElementName[] | 'all' | 'none' = 'none',
        possibleYieldingMarkdownElements: MarkdownElementName[] | 'none' = 'none',
    ) {
        this.__markdownElement = markdownElement;
        this.__possibleNestedMarkdownElements = possibleNestedMarkdownElements === 'all'
            ? allMarkdownElementNames : possibleNestedMarkdownElements === 'none'
                ? []
                : possibleNestedMarkdownElements;

        this.__possibleYieldingMarkdownElements = possibleYieldingMarkdownElements === 'none' ? []
            : possibleYieldingMarkdownElements;
    }

    public get canLeadToClosingOrNewMarkdown(): boolean {
        if (!this.__latestSequenceProcessed) {
            this.processSequence();
        }

        return this.__canLeadToClosingMarkdown
            || this.__potentialYieldingMarkdownElements.length > 0
            || this.__potentialNestedMarkdownElements.length > 0;
    }

    public get elementToCreateAtParentLevel(): MarkdownElementName | undefined {
        if (!this.__latestSequenceProcessed) {
            this.processSequence();
        }

        return this.__markdownThatShouldBeRenderedAtParentLevel;
    }

    public get nestedElementToCreate(): MarkdownElementName | undefined {
        if (!this.__latestSequenceProcessed) {
            this.processSequence();
        }

        return this.__markdownThatShouldBeNested;
    }

    public get sequence(): string {
        return this.__sequence;
    }

    public get shouldCloseCurrentMarkdown(): boolean {
        if (!this.__latestSequenceProcessed) {
            this.processSequence();
        }

        return this.__shouldCloseCurrentMarkdown;
    }

    public appendCharacter(character: string): void {
        this.__sequence += character;
        this.__latestSequenceProcessed = false;
    }

    public reset() {
        this.__sequence = '';
        this.__latestSequenceProcessed = false;

        this.__canLeadToClosingMarkdown = false;
        this.__potentialYieldingMarkdownElements = [];
        this.__potentialNestedMarkdownElements = [];

        this.__shouldCloseCurrentMarkdown = false;

        this.__markdownThatShouldBeRenderedAtParentLevel = undefined;
        this.__markdownThatShouldBeNested = undefined;
    }

    private processSequence(): void {
        if (this.__latestSequenceProcessed) {
            return;
        }

        const sequence = this.__sequence;

        //
        // Potential states, for sequences that are incomplete:
        //
        this.__canLeadToClosingMarkdown = checkSequence(this.__markdownElement, 'canClose')(sequence);

        this.__potentialYieldingMarkdownElements = this.__possibleYieldingMarkdownElements
            .filter(
                (markdownElement) => checkSequence(markdownElement, 'canOpen')(sequence),
            );

        this.__potentialNestedMarkdownElements = this.__possibleNestedMarkdownElements
            .filter(
                (markdownElement) => checkSequence(markdownElement, 'canOpen')(sequence),
            );

        //
        // Final states, that should lead to end of sequence and change in DOM structure:
        // And markdown elements that can be created (nested or rendered at parent level)
        //

        this.__shouldCloseCurrentMarkdown = checkSequence(this.__markdownElement, 'shouldClose')(sequence);

        this.__markdownThatShouldBeRenderedAtParentLevel = this.__possibleYieldingMarkdownElements
            .find((markdownElement) => checkSequence(markdownElement, 'shouldOpen')(sequence));

        this.__markdownThatShouldBeNested = this.__possibleNestedMarkdownElements
            .find((markdownElement) => checkSequence(markdownElement, 'shouldOpen')(sequence));
    }
}
