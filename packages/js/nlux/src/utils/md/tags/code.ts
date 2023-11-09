import {Sequence, Tag} from '../tag';

export const code: Tag = {
    name: 'code',
    characterChecks: {
        canStartSequence: (character: string, previousCharacter: string | null) => (
            character === '`' && (previousCharacter === null || previousCharacter === '\n')
        ),
        canBePartOfOpeningSequence: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) =>
            false
        ,
        shouldOpen: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) => (
            character !== '`' && currentSequence?.value === '`'
        ),
        canStartClosingSequence: (character: string, previousCharacter: string | null) =>
            false
        ,
        canBePartOfClosingSequence: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) =>
            false,
        shouldClose: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) =>
            previousCharacter === '`'
        ,
    },
    create: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) => {
        const newElement = document.createElement('code');
        if (character) {
            newElement.append(character);
        }
        return newElement;
    },
};
