import {Markdown, Sequence} from '../markdown';

export const backtick3: Markdown = {
    code: '```',
    tagName: 'pre',
    characterChecks: {
        canStartSequence: (character: string, previousCharacter: string | null) => (
            character === '`'
        ),
        canBePartOfOpeningSequence: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) =>
            currentSequence !== null && (
                (character === '`' && ['`', '``'].includes(currentSequence.value)) ||
                (currentSequence.value.startsWith('```') && character !== '\n')
            )
        ,
        shouldOpen: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) => (
            character === '\n' && currentSequence !== null && currentSequence.value.startsWith('```')
        ),
        canStartClosingSequence: (character: string, previousCharacter: string | null) =>
            character === '`' && previousCharacter === '\n'
        ,
        canBePartOfClosingSequence: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) =>
            currentSequence !== null && currentSequence.value.startsWith('`') && character === '`'
        ,
        shouldClose: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) =>
            currentSequence?.value === '```'
        ,
    },
    create: (character: string, previousCharacter: string | null, currentSequence: Sequence | null) => {
        const regEx = /^```([\w]+){1}(\s+(.*))?$/;
        const matches = regEx.exec(currentSequence?.value ?? '');
        const language = matches?.[1] ?? '';
        const title = matches?.[3] ?? '';

        const element = document.createElement('pre');
        if (language) {
            element.dataset.language = language;
        }

        if (title) {
            element.dataset.title = title;
        }

        return element;
    },
    append: (element: HTMLElement, character: string, previousCharacter: string | null) => {
        if (character && (character !== '\n' || element.innerHTML !== '')) {
            element.append(character);
        }
    },
};
