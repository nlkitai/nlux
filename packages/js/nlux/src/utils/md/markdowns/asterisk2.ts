import {Markdown, Sequence} from '../markdown';

export const asterisk2: Markdown = {
    code: '**',
    tagName: 'strong',
    canContain: ['code', 'strong', 'em', 'del'],
    characterChecks: {
        canStartSequence: (character: string, previousCharacter: string | null) => (
            character === '*'
        ),
        canBePartOfOpeningSequence: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) =>
            character === '*' && currentSequence?.value === '*'
        ,
        shouldOpen: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) => (
            currentSequence?.value === '**'
        ),
        canStartClosingSequence: (character: string, previousCharacter: string | null) =>
            character === '*'
        ,
        canBePartOfClosingSequence: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) =>
            character === '*' && currentSequence?.value === '*'
        ,
        shouldClose: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) =>
            currentSequence?.value === '**'
        ,
    },
    create: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) => {
        return document.createElement('strong');
    },
    append: (element: HTMLElement, character: string, previousCharacter: string | null) => {
        if (character) {
            element.append(character);
        }
    },
};
