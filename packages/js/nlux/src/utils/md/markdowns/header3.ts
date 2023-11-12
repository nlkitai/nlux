import {Markdown, Sequence} from '../markdown';

export const header3: Markdown = {
    code: '###',
    tagName: 'h3',
    canContain: ['code', 'strong', 'em', 'del'],
    characterChecks: {
        canStartSequence: (character: string, previousCharacter: string | null) => (
            character === '#' && (previousCharacter === null || previousCharacter === '\n')
        ),
        canBePartOfOpeningSequence: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) =>
            character === '#'
        ,
        shouldOpen: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) => (
            character !== '#' && currentSequence?.value === '###'
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
        return document.createElement('h3');
    },
    append: (element: HTMLElement, character: string, previousCharacter: string | null) => {
        if (character) {
            if (element.innerHTML === '' && (character === '\n' || character === ' ')) {
                return;
            }

            element.append(character);
        }
    },
};
