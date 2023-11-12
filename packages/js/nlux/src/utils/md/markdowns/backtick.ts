import {Markdown, Sequence} from '../markdown';

export const backtick: Markdown = {
    code: '`',
    tagName: 'code',
    canContain: ['strong', 'em', 'del'],
    characterChecks: {
        canStartSequence: (character: string, previousCharacter: string | null) => (
            character === '`'
        ),
        canBePartOfOpeningSequence: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) =>
            false
        ,
        shouldOpen: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) => (
            currentSequence?.value === '`' && character !== '`'
        ),
        canStartClosingSequence: (character: string, previousCharacter: string | null) =>
            character === '`'
        ,
        canBePartOfClosingSequence: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) =>
            false,
        shouldClose: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) =>
            currentSequence?.value === '`'
        ,
    },
    create: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) => {
        return document.createElement('code');
    },
    append: (element: HTMLElement, character: string, previousCharacter: string | null) => {
        if (character) {
            if (element.innerHTML === '' && character === '\n') {
                return;
            }

            element.append(character);
        }
    },
};
