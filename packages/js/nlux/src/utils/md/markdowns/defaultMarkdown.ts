import {Markdown, Sequence, specialMarkdownCharacters} from '../markdown';

export const defaultMarkdown: Markdown = {
    code: 'default',
    tagName: 'p',
    canContain: ['code', 'strong', 'em', 'del'],
    characterChecks: {
        canStartSequence: (character: string, previousCharacter: string | null) => (
            character !== '\n'
        ),
        canBePartOfOpeningSequence: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) =>
            false
        ,
        shouldOpen: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) =>
            false // A paragraph is the default when nothing else is open (done programmatically)
        ,
        canStartClosingSequence: (character: string, previousCharacter: string | null) =>
            false
        ,
        canBePartOfClosingSequence: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) =>
            false
        ,
        shouldClose: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) =>
            (character === '\n' && previousCharacter === '\n') ||
            (previousCharacter === '\n' && specialMarkdownCharacters.has(character))
        ,
    },
    create: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) => {
        return document.createElement('p');
    },
    append: (element: HTMLElement, character: string, previousCharacter: string | null) => {
        if (character) {
            if (character === '\n' && previousCharacter === '\n') {
                element.append(document.createElement('br'));
                return;
            }

            if (previousCharacter === '\n' && !specialMarkdownCharacters.has(character)) {
                element.append(document.createElement('br'));

                if (character !== '\n') {
                    element.append(character);
                }
            } else {
                if (character !== '\n') {
                    element.append(character);
                }
            }
        }
    },
};
