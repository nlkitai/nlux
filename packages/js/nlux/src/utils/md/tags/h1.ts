import {Sequence, Tag} from '../tag';

export const h1: Tag = {
    name: 'h1',
    characterChecks: {
        canStartSequence: (character: string, previousCharacter: string | null) => (
            character === '#' && (previousCharacter === null || previousCharacter === '\n')
        ),
        canBePartOfOpeningSequence: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) =>
            false
        ,
        shouldOpen: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) => (
            character !== '#' && currentSequence?.value === '#'
        ),
        canStartClosingSequence: (character: string, previousCharacter: string | null) => (
            character === '\n'
        ),
        canBePartOfClosingSequence: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) =>
            false,
        shouldClose: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) =>
            character === '\n',
    },
    create: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) => {
        const newElement = document.createElement('h1');
        if (character && character !== ' ' && character !== '\n') {
            newElement.append(character);
        }
        return newElement;
    },
};
