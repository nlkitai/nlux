import {MarkdownElementName} from '../../../../types/markdown/markdownElement';
import {MarkdownProcessorInterface} from '../../../../types/markdown/markdownProcessorInterface';
import {isWhitespaceOrNewLine} from '../../../../x/character/isWhitespaceOrNewLine';
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

        if (!this.markdownProcessorOptions.skipCopyToClipboardButton) {
            this.insertCopyToClipboardButton();
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
                    this.currentLineContainer.innerHTML = ' ';
                }

                this.currentLineContainer = null;
            } else {
                // If current line is empty, and some code has already been rendered
                // We add an empty line (for spacing purposes)
                if (this.codeContainer.innerHTML) {
                    const newEmptyLine = document.createElement('div');
                    newEmptyLine.innerHTML = ' ';
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

                this.currentLineContainer.innerHTML = highlight(innerContent, language);
            }
        }
    }

    private insertCopyToClipboardButton() {
        if (!this.domElement) {
            return;
        }

        const title = 'Copy code to clipboard';
        const copyButton = document.createElement('button');
        copyButton.classList.add('copy-button');
        copyButton.setAttribute('aria-label', title);
        copyButton.setAttribute('title', title);
        copyButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">'
            + '<path fill-rule="evenodd" clip-rule="evenodd" d="M15 1.25H10.9436C9.10583 1.24998 7.65019 1.24997 6.51098 1.40314C5.33856 1.56076 4.38961 1.89288 3.64124 2.64124C2.89288 3.38961 2.56076 4.33856 2.40314 5.51098C2.24997 6.65019 2.24998 8.10582 2.25 9.94357V16C2.25 17.8722 3.62205 19.424 5.41551 19.7047C5.55348 20.4687 5.81753 21.1208 6.34835 21.6517C6.95027 22.2536 7.70814 22.5125 8.60825 22.6335C9.47522 22.75 10.5775 22.75 11.9451 22.75H15.0549C16.4225 22.75 17.5248 22.75 18.3918 22.6335C19.2919 22.5125 20.0497 22.2536 20.6517 21.6517C21.2536 21.0497 21.5125 20.2919 21.6335 19.3918C21.75 18.5248 21.75 17.4225 21.75 16.0549V10.9451C21.75 9.57754 21.75 8.47522 21.6335 7.60825C21.5125 6.70814 21.2536 5.95027 20.6517 5.34835C20.1208 4.81753 19.4687 4.55348 18.7047 4.41551C18.424 2.62205 16.8722 1.25 15 1.25ZM17.1293 4.27117C16.8265 3.38623 15.9876 2.75 15 2.75H11C9.09318 2.75 7.73851 2.75159 6.71085 2.88976C5.70476 3.02502 5.12511 3.27869 4.7019 3.7019C4.27869 4.12511 4.02502 4.70476 3.88976 5.71085C3.75159 6.73851 3.75 8.09318 3.75 10V16C3.75 16.9876 4.38624 17.8265 5.27117 18.1293C5.24998 17.5194 5.24999 16.8297 5.25 16.0549V10.9451C5.24998 9.57754 5.24996 8.47522 5.36652 7.60825C5.48754 6.70814 5.74643 5.95027 6.34835 5.34835C6.95027 4.74643 7.70814 4.48754 8.60825 4.36652C9.47522 4.24996 10.5775 4.24998 11.9451 4.25H15.0549C15.8297 4.24999 16.5194 4.24998 17.1293 4.27117ZM7.40901 6.40901C7.68577 6.13225 8.07435 5.9518 8.80812 5.85315C9.56347 5.75159 10.5646 5.75 12 5.75H15C16.4354 5.75 17.4365 5.75159 18.1919 5.85315C18.9257 5.9518 19.3142 6.13225 19.591 6.40901C19.8678 6.68577 20.0482 7.07435 20.1469 7.80812C20.2484 8.56347 20.25 9.56458 20.25 11V16C20.25 17.4354 20.2484 18.4365 20.1469 19.1919C20.0482 19.9257 19.8678 20.3142 19.591 20.591C19.3142 20.8678 18.9257 21.0482 18.1919 21.1469C17.4365 21.2484 16.4354 21.25 15 21.25H12C10.5646 21.25 9.56347 21.2484 8.80812 21.1469C8.07435 21.0482 7.68577 20.8678 7.40901 20.591C7.13225 20.3142 6.9518 19.9257 6.85315 19.1919C6.75159 18.4365 6.75 17.4354 6.75 16V11C6.75 9.56458 6.75159 8.56347 6.85315 7.80812C6.9518 7.07435 7.13225 6.68577 7.40901 6.40901Z" fill="currentColor"/>'
            + '</svg>';

        // We keep a reference to the DOM element in the function scope
        // because this.domElement will be nullified after yielding
        const codeContainer = this.codeContainer;

        let clicked = false;
        copyButton.addEventListener('click', () => {
            if (clicked || !codeContainer) {
                return;
            }

            // Copy code to clipboard
            const code = codeContainer.innerText;
            navigator.clipboard.writeText(code ?? '');

            // Mark button as clicked for 1 second
            clicked = true;
            copyButton.classList.add('clicked');
            setTimeout(() => {
                clicked = false;
                copyButton.classList.remove('clicked');
            }, 1000);
        });

        // Insert copy button before code block
        this.domElement.insertAdjacentElement('beforebegin', copyButton);
    }
}
