import {MarkdownElementName} from '../../../types/markdown/markdownElement';
import {MarkdownProcessorInterface} from '../../../types/markdown/markdownProcessorInterface';
import {isWhitespaceOrNewLine} from '../../../utils/character/isWhitespaceOrNewLine';
import {attachCopyClickListener} from '../../copyToClipboard/attachCopyClickListener';
import {insertCopyToClipboardButton} from '../../copyToClipboard/insertCopyToClipboardButton';
import {MarkdownProcessorOptions} from './baseProcessor';
import {ProcessorWithChildren} from './baseProcessorWithChildren';

export class CodeBlock extends ProcessorWithChildren {
    private codeContainer: HTMLPreElement | null = null;
    private currentLineContainer: HTMLDivElement | null = null;
    private readonly language?: string;

    constructor(
        parent: MarkdownProcessorInterface,
        openingSequence?: string,
        initialContent?: string,
        options: MarkdownProcessorOptions = {},
    ) {
        super(
            parent,
            'CodeBlock',
            openingSequence ?? null,
            !initialContent || isWhitespaceOrNewLine(initialContent) ? null : initialContent,
            options,
        );

        this.language = this.extractLanguageFromOpeningSequence(openingSequence);
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
        const element = document.createElement('div');
        element.classList.add('code-block');

        this.codeContainer = document.createElement('pre');
        element.append(this.codeContainer);

        if (this.language) {
            this.codeContainer.dataset.language = this.language;
        }

        return element;
    }

    processCharacter(character: string): void {
        this.preProcessCharacter(character);

        const {
            sequenceDiscarded,
            discardedSequence,
            yielded,
        } = this.processSequence(character);

        if (yielded) {
            return;
        }

        if (!sequenceDiscarded) {
            // Still checking if the sequence is can yield something or not
            // Do not render the character yet as it has been used in the sequence
            return;
        }

        // We append the entire discarded sequence
        if (discardedSequence && discardedSequence.length > 1 && this.codeContainer) {
            // Append the discarded sequence to the DOM:
            // Character by character - EXCLUDING the last character (which is the current character)
            for (let i = 0; i < discardedSequence.length - 1; i++) {
                this.appendCharacterToCodeBlock(discardedSequence[i]);
            }
        }

        // IMPORTANT: Here, the previous sequence has been discarded, and we want to check if the character is part of
        // a new sequence or not! That's why we reset the parser and check for the 1 character sequence.
        this.resetSequenceParser();
        const secondCheck = this.processSequence(character);

        if (secondCheck.sequenceDiscarded) {
            // The 1 character sequence is discarded, so we render
            this.sequenceParser.reset();
            this.appendCharacterToCodeBlock(character);
        }
    }

    yield(elementToCreateAtParentLevel?: MarkdownElementName, characterToAppendToParent?: string) {
        this.highlightCurrentLine();

        if (this.markdownProcessorOptions.showCodeBlockCopyButton !== false) { // Defaults to true when undefined
            const container = this.__parent?.domElement;
            if (container) {
                insertCopyToClipboardButton(container);
                attachCopyClickListener(container);
            }
        }

        super.yield(elementToCreateAtParentLevel, characterToAppendToParent);

        this.codeContainer = null;
        this.currentLineContainer = null;
    }

    private appendCharacterToCodeBlock(character: string) {
        if (!this.codeContainer) {
            return;
        }

        // Appending a new line character
        // which means we are done with the current line
        if (character === '\n') {
            // We highlight the current line and reset its content
            if (this.currentLineContainer) {
                if (this.currentLineContainer.innerHTML) {
                    this.highlightCurrentLine();
                } else {
                    this.currentLineContainer.replaceChildren(' ');
                }

                this.currentLineContainer = null;
            } else {
                // If current line is empty, and some code has already been rendered
                // We add an empty line (for spacing purposes)
                if (this.codeContainer.innerHTML) {
                    const newEmptyLine = document.createElement('div');
                    newEmptyLine.replaceChildren(' ');
                    this.codeContainer.append(newEmptyLine);
                }
            }

            return;
        }

        if (!this.currentLineContainer) {
            this.currentLineContainer = document.createElement('div');
            this.codeContainer.append(this.currentLineContainer);
        }

        this.currentLineContainer.append(character);
    }

    private extractLanguageFromOpeningSequence(openingSequence: string | undefined): string | undefined {
        if (!openingSequence) {
            return undefined;
        }

        const matches = openingSequence.match(/```(\w+)/);
        return Array.isArray(matches) && matches.length > 1 ? matches[1] : undefined;
    }

    private highlightCurrentLine() {
        if (!this.domElement || !this.currentLineContainer) {
            return;
        }

        // Apply syntax highlighting to the current line
        // We attempt to retrieve the code via innerText first, and fallback to innerHTML
        const innerContent = this.currentLineContainer.innerText ?? this.currentLineContainer.innerHTML;
        if (this.syntaxHighlighter && this.codeContainer && innerContent) {
            const language = this.codeContainer.dataset.language;
            if (language) {
                const highlight = this.syntaxHighlighter.createHighlighter({
                    language,
                    colorMode: 'dark',
                });

                const languageClass = this.syntaxHighlighter.highlightingClass(language);
                if (!this.codeContainer.classList.contains(languageClass)) {
                    this.codeContainer.classList.add(languageClass);
                }

                const highlightedHtml = highlight(innerContent, language);
                this.currentLineContainer.innerHTML = this.htmlSanitizer
                    ? this.htmlSanitizer(highlightedHtml)
                    : highlightedHtml;
            }
        }
    }
}
