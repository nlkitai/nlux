import {Markdown, Sequence} from '../markdown';

export const asterisk1: Markdown = {
    code: '*',
    tagName: 'em',
    canContain: ['code', 'strong', 'em', 'del'],
    characterChecks: {
        canStartSequence: (character: string, previousCharacter: string | null) => (
            character === '*'
        ),
        canBePartOfOpeningSequence: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) =>
            currentSequence?.value === '*'
        ,
        shouldOpen: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) => (
            currentSequence?.value === '*' && character !== '*'
        ),
        canStartClosingSequence: (character: string, previousCharacter: string | null) =>
            character === '*'
        ,
        canBePartOfClosingSequence: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) =>
            currentSequence?.value === '*'
        ,
        shouldClose: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) =>
            (currentSequence?.value === '*' && character !== '*')
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
