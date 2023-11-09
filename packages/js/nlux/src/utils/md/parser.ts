import {defaultTagName, Sequence, specialMarkdownCharacters} from './tag';
import {TagsByName} from './tags';
import {pre} from './tags/pre';

const maxOpeningSequenceLength = 100;
const allTagsExceptDefaultTag = Object.values(TagsByName).filter(tag => tag.name !== defaultTagName);

export const parse = (
    currentElement: HTMLElement | null,
    currentSequence: Sequence | null,
    previousCharacter: string | null,
    currentCharacter: string,
): {
    actionPerformed: 'elementCreated' | 'elementUpdated' | 'elementClosed' | 'possibleSequenceFound' | 'none',
    element: HTMLElement | null,
    sequence: Sequence | null,
} => {
    // When a current element is present, we are in the middle of parsing a tag
    // Don't do anything until the tag is closed. Simply append the new character to the current element.
    // TODO - Change this to support nested tags

    if (currentElement) {
        const tag = TagsByName[currentElement.tagName.toLowerCase()];
        if (tag.characterChecks.shouldClose(
            currentCharacter,
            previousCharacter,
            currentSequence,
        )) {
            const canStartSequence = tag.characterChecks.canStartSequence(
                currentCharacter,
                previousCharacter,
            );

            // When closing, also check if the closing character can start a new sequence.
            // Example: When a # is present in a new line after a paragraph, it should open a header
            // and close the paragraph at the same time.
            const newSequence: Sequence | null = canStartSequence ? {
                type: 'opening',
                value: currentCharacter,
                possibleTags: new Set([tag.name]),
            } : null;

            return {
                element: null,
                sequence: newSequence,
                actionPerformed: 'elementClosed',
            };
        }

        if (currentSequence) {
            if (tag.characterChecks.canBePartOfClosingSequence(currentCharacter, previousCharacter, currentSequence)) {
                return {
                    element: currentElement,
                    sequence: {
                        type: 'closing',
                        value: currentSequence.value + currentCharacter,
                        possibleTags: new Set([tag.name]),
                    },
                    actionPerformed: 'possibleSequenceFound',
                };
            }
        } else {
            if (tag.characterChecks.canStartClosingSequence(currentCharacter, previousCharacter)) {
                return {
                    element: null,
                    sequence: {
                        type: 'closing',
                        value: currentCharacter,
                        possibleTags: new Set([tag.name]),
                    },
                    actionPerformed: 'possibleSequenceFound',
                };
            }
        }

        if (
            previousCharacter === '\n' &&
            !specialMarkdownCharacters.has(currentCharacter) &&
            currentElement.tagName.toLowerCase() === 'p' &&
            currentElement.innerHTML !== ''
        ) {
            currentElement.append(document.createElement('br'));
        }

        // Only render \n characters if the tag is a pre tag
        if (currentCharacter !== '\n' || tag.name === pre.name) {
            currentElement.append(currentCharacter);
        }

        return {
            element: currentElement,
            sequence: currentSequence,
            actionPerformed: 'elementUpdated',
        };
    }

    // Look for possible tags that can be opened by this character
    // If none, create a P tag and append the character to it
    const possibleSequence: Sequence = {
        type: 'opening',
        value: currentSequence ? currentSequence.value + currentCharacter : currentCharacter,
        possibleTags: new Set(),
    };

    // Only check for possible tags that can match the current sequence
    // if the max sequence length is not reached -
    if (possibleSequence.value.length <= maxOpeningSequenceLength) {
        for (const tag of allTagsExceptDefaultTag) {
            if (tag.characterChecks.shouldOpen(currentCharacter, previousCharacter, currentSequence)) {
                const element = tag.create(currentCharacter, previousCharacter, currentSequence);

                return {
                    element,
                    sequence: currentSequence,
                    actionPerformed: 'elementCreated',
                };
            }

            if (
                tag.characterChecks.canStartSequence(currentCharacter, previousCharacter) ||
                currentSequence && tag.characterChecks.canBePartOfOpeningSequence(currentCharacter,
                    previousCharacter,
                    currentSequence)
            ) {
                possibleSequence.possibleTags.add(tag.name);
            }
        }

        if (possibleSequence.possibleTags.size > 0) {
            return {
                element: null,
                sequence: possibleSequence,
                actionPerformed: 'possibleSequenceFound',
            };
        }
    }

    if (currentSequence?.value.length === maxOpeningSequenceLength) {
        const element = document.createElement(defaultTagName);
        element.append(currentSequence.value);
        element.append(currentCharacter);

        return {
            element,
            sequence: null,
            actionPerformed: 'elementCreated',
        };
    }

    // If no tag can be opened, and the character is not a blank space or new line,
    // create a P tag and append the character to it
    if (currentCharacter !== ' ' && currentCharacter !== '\n') {
        const element = document.createElement(defaultTagName);
        element.append(currentCharacter);

        return {
            element,
            sequence: null,
            actionPerformed: 'elementCreated',
        };
    }

    return {
        element: currentElement,
        sequence: currentSequence,
        actionPerformed: 'none',
    };
};
