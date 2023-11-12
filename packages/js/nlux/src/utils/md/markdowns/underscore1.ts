import {Markdown, Sequence} from '../markdown';

export const underscore1: Markdown = {
    code: '_',
    tagName: 'em',
    canContain: ['code', 'strong', 'em', 'del'],
    characterChecks: {
        canStartSequence: (character: string, previousCharacter: string | null) => (
            character === '_'
        ),
        canBePartOfOpeningSequence: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) =>
            currentSequence?.value === '_'
        ,
        shouldOpen: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) => (
            currentSequence?.value === '_' && character !== '_'
        ),
        canStartClosingSequence: (character: string, previousCharacter: string | null) =>
            character === '_'
        ,
        canBePartOfClosingSequence: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) =>
            currentSequence?.value === '_'
        ,
        shouldClose: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) =>
            (currentSequence?.value === '_' && character !== '_')
        ,
    },
    create: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) => {
        return document.createElement('em');
    },
    append: (element: HTMLElement, character: string, previousCharacter: string | null) => {
        if (character) {
            element.append(character);
        }
    },
};
