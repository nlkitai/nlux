import {Sequence, specialMarkdownCharacters, Tag} from '../tag';

export const p: Tag = {
    name: 'p',
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
        const newElement = document.createElement('p');
        if (character) {
            newElement.append(character);
        }
        return newElement;
    },
};
