import {TagName} from './tags';

export const specialMarkdownCharacters = new Set([
    '\\', '`', '*', '_', '{', '}', '[', ']', '<', '>', '(', ')', '#', '+', '-', '.', '!', '|',
]);

export type MarkdownCode = 'default' | '*' | '**' | '`' | '```' | '_' | '__' | '#' | '##' | '###';

// 'url' is not a tag, but it's the () syntax for links and images.
// 'table', 'thead', 'tbody', 'tr', 'th', 'td' are not supported yet.
// 'h4', 'h5', 'h6' will not be supported.

export type Markdown = {
    code: MarkdownCode;
    tagName: TagName;
    characterChecks: {
        // Check if a character can be part the first part of a sequence that would open a tag.
        // One such a character is found, we start a sequence.
        // Example: The first '#' in '##' should start a sequence.
        canStartSequence: (character: string, previousCharacter: string | null) => boolean;
        canStartClosingSequence: (character: string, previousCharacter: string | null) => boolean;

        // When a sequence is started, we check if a character can be part of the sequence.
        // Example: The second '#' in '##' should be part of the sequence.
        canBePartOfOpeningSequence: (character: string, previousCharacter: string | null, currentSequence: Sequence) => boolean;
        canBePartOfClosingSequence: (character: string, previousCharacter: string | null, currentSequence: Sequence) => boolean;

        // We check for 'should open' on the first character after a sequence matching an opening sequence.
        // Example: The first space ' ' after '##' should open a header.
        // Example: The first new line '\n' after '##' should open an empty header.
        shouldOpen: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) => boolean;
        shouldClose: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) => boolean;
    },
    // For links and images, when we have a URL that follows the tag.
    mustBeFollowedBy?: TagName;

    // Other that it can contain.
    canContain?: TagName[];

    // The character passed is the one that triggered the opening of the tag.
    // Example: The first space ' ' after '##' opened the <h2 /> tag.
    // Example: The first alphanumerical character after '[' opened the <a /> tag.
    // We pass it to the tag so it can be inserted in the tag if needed (it's the case for the tag).
    create: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) => HTMLElement;

    // Appends a character to the tag.
    append: (element: HTMLElement, character: string, previousCharacter: string | null) => void;
}

export type OpeningSequence = {
    type: 'opening';
    value: string;
    possibleMarkdowns: Set<Markdown>;
}

export type ClosingSequence = {
    type: 'closing';
    value: string;
    possibleMarkdowns: Set<Markdown>;
}

export type Sequence = OpeningSequence | ClosingSequence;

