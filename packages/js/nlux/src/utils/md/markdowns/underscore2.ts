import {Markdown, Sequence} from '../markdown';

export const underscore2: Markdown = {
    code: '**',
    tagName: 'strong',
    canContain: ['code', 'strong', 'em', 'del'],
    characterChecks: {
        canStartSequence: (character: string, previousCharacter: string | null) => (
            character === '_'
        ),
        canBePartOfOpeningSequence: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) =>
            character === '_' && currentSequence?.value === '_'
        ,
        shouldOpen: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) => (
            currentSequence?.value === '__'
        ),
        canStartClosingSequence: (character: string, previousCharacter: string | null) =>
            character === '_'
        ,
        canBePartOfClosingSequence: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) =>
            character === '_' && currentSequence?.value === '_'
        ,
        shouldClose: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) =>
            currentSequence?.value === '__'
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
