import {warn} from '../../x/debug';
import {Markdown, OpeningSequence, Sequence} from './markdown';
import {defaultMarkdown} from './markdowns/defaultMarkdown';
import {defaultTagName, MarkdownsByTagName} from './tags';

const maxOpeningSequenceLength = 100;
const allMarkdownsExceptDefault = [...MarkdownsByTagName.keys()]
    .filter(key => key !== defaultTagName)
    .map(key => MarkdownsByTagName.get(key) as Markdown[])
    .reduce((acc, val) => acc.concat(val), []);

export type ParseResult = {
    actionPerformed: 'elementCreated',
    element: HTMLElement,
    markdown: Markdown,
    nestedSequence: OpeningSequence | null,
} | {
    actionPerformed: 'elementUpdated',
} | {
    actionPerformed: 'elementClosed',
    newSequence: OpeningSequence | null,
} | {
    actionPerformed: 'possibleSequenceFound',
    sequence: Sequence,
} | {
    actionPerformed: 'nestedElementCreated',
    nestedElement: HTMLElement,
    nestedMarkdown: Markdown,
    nestedSequence: OpeningSequence | null,
} | {
    actionPerformed: 'possibleNestedSequenceFound',
    nestedSequence: OpeningSequence,
} | {
    actionPerformed: 'none',
    element?: HTMLElement | null,
    sequence?: Sequence | null,
    nestedElement?: HTMLElement | null,
    nestedSequence?: Sequence | null,
};

export const parse = (
    currentElement: HTMLElement | null,
    currentMarkdown: Markdown | null,
    currentSequence: Sequence | null,
    nestedSequence: Sequence | null,
    previousCharacter: string | null,
    currentCharacter: string,
): ParseResult => {
    //
    // Case 1️⃣ - No element is open!
    //
    // We need to check for 2 things:
    // 1. If the current character can be part of an opening sequence (Example: # in ##)
    // 2. If the current character can actually open a new element (Example: A space after ##, or an alphanumerical
    // character at the beginning of a line)
    //
    if (!currentElement) {
        // Look for possible tags that can be opened by this character
        // If none, create a P tag and append the character to it
        const possibleSequence: OpeningSequence = {
            type: 'opening',
            value: (currentSequence && currentSequence.type === 'opening')
                ? currentSequence.value + currentCharacter
                : currentCharacter,
            possibleMarkdowns: new Set(),
        };

        // Only check for possible tags that can match the current sequence
        // if the max sequence length is not reached or if we're exactly at the max sequence length
        if (possibleSequence.value.length <= maxOpeningSequenceLength) {
            for (const markdown of allMarkdownsExceptDefault) {
                if (markdown.characterChecks.shouldOpen(currentCharacter, previousCharacter, currentSequence)) {
                    const element = markdown.create(currentCharacter, previousCharacter, currentSequence);

                    // Check if the character that triggered the opening of the tag can also start a nested sequence
                    // Example: *** should open a <strong> tag, but also a <em> tag inside it.
                    const possibleNestedSequence: OpeningSequence = {
                        type: 'opening',
                        value: currentCharacter,
                        possibleMarkdowns: new Set(),
                    };

                    if (markdown.canContain && markdown.canContain.length > 0) {
                        for (const nestedTagName of markdown?.canContain || []) {
                            const possibleNestedMarkdowns = MarkdownsByTagName.get(nestedTagName);
                            if (!possibleNestedMarkdowns) {
                                // Not supposed to happen - but added for TypeScript to be happy
                                warn('MD parser: Unknown tag "' + nestedTagName + '"');
                                continue;
                            }

                            possibleNestedMarkdowns.forEach(nestedMarkdown => {
                                if (nestedMarkdown.characterChecks.canStartSequence(currentCharacter,
                                    previousCharacter)) {
                                    possibleNestedSequence.possibleMarkdowns.add(nestedMarkdown);
                                }
                            });
                        }
                    }

                    const nestedSequence = possibleNestedSequence.possibleMarkdowns.size > 0
                        ? possibleNestedSequence
                        : null;

                    if (!nestedSequence) {
                        markdown.append(element, currentCharacter, previousCharacter);
                    }

                    return {
                        actionPerformed: 'elementCreated',
                        markdown,
                        element,
                        nestedSequence,
                    };
                }

                if (
                    markdown.characterChecks.canStartSequence(currentCharacter, previousCharacter) ||
                    currentSequence && markdown.characterChecks.canBePartOfOpeningSequence(currentCharacter,
                        previousCharacter,
                        currentSequence)
                ) {
                    possibleSequence.possibleMarkdowns.add(markdown);
                }
            }

            if (possibleSequence.possibleMarkdowns.size > 0) {
                return {
                    actionPerformed: 'possibleSequenceFound',
                    sequence: possibleSequence,
                };
            }
        }

        // If we are at the max sequence length, and no tag can be opened, we create a P tag and append the sequence
        if (currentSequence?.value.length === maxOpeningSequenceLength) {
            const element = defaultMarkdown.create(currentSequence.value, null, null);
            defaultMarkdown.append(element, currentSequence.value, null);
            defaultMarkdown.append(element, currentCharacter, null);

            return {
                actionPerformed: 'elementCreated',
                markdown: defaultMarkdown,
                element,
                nestedSequence: null,
            };
        }

        // If no tag can be opened, and the character is not a blank space or new line:
        // Create a P tag and append the character to it
        if (currentCharacter !== ' ' && currentCharacter !== '\n') {
            const element = document.createElement(defaultTagName);
            defaultMarkdown.append(element, currentCharacter, null);

            return {
                actionPerformed: 'elementCreated',
                markdown: defaultMarkdown,
                element,
                nestedSequence: null,
            };
        }

        return {
            actionPerformed: 'none',
            element: currentElement,
            sequence: currentSequence,
            nestedElement: null,
            nestedSequence: null,
        };
    }

    //
    // Case 2️⃣ - An element is open
    //
    // A. We either need to check if the current character can close the element,
    // Or B. if the current character can open a new nested element,
    // Or C. We append the character to the element.
    //

    //
    // Case 2️⃣ 🅰️ - Check if the current character can close the element
    //
    const tagName = currentElement.tagName.toLowerCase();
    if (!currentMarkdown || currentMarkdown.tagName !== tagName) {
        // Not supposed to happen unless major programming error where a tag is not added to TagsByName map
        // but added this warning for TypeScript to be happy
        warn('MD parser: Unknown tag "' + tagName + '" or tag/markdown mismatch for markdown "'
            + currentMarkdown?.code + '"');
        return {
            actionPerformed: 'none',
            element: currentElement,
            sequence: currentSequence,
            nestedElement: null,
            nestedSequence: null,
        };
    }

    if (currentMarkdown.characterChecks.shouldClose(
        currentCharacter,
        previousCharacter,
        currentSequence,
    )) {
        const canStartSequence = currentMarkdown.characterChecks.canStartSequence(
            currentCharacter,
            previousCharacter,
        );

        // When closing, also check if the closing character can start a new sequence.
        // Example: When a # is present in a new line after a paragraph, it should open a header
        // and close the paragraph at the same time.
        const newSequence: OpeningSequence | null = canStartSequence ? {
            type: 'opening',
            value: currentCharacter,
            possibleMarkdowns: new Set([]),
        } : null;

        if (newSequence) {
            for (const markdown of allMarkdownsExceptDefault) {
                if (markdown.characterChecks.canStartSequence(currentCharacter, previousCharacter)) {
                    newSequence.possibleMarkdowns.add(markdown);
                }
            }
        }

        return {
            actionPerformed: 'elementClosed',
            newSequence,
        };
    }

    if (currentSequence) {
        if (currentMarkdown.characterChecks
            .canBePartOfClosingSequence(currentCharacter, previousCharacter, currentSequence)
        ) {
            return {
                actionPerformed: 'possibleSequenceFound',
                sequence: {
                    type: 'closing',
                    value: currentSequence.value + currentCharacter,
                    possibleMarkdowns: new Set([currentMarkdown]),
                },
            };
        }
    } else {
        if (currentMarkdown.characterChecks.canStartClosingSequence(currentCharacter, previousCharacter)) {
            return {
                actionPerformed: 'possibleSequenceFound',
                sequence: {
                    type: 'closing',
                    value: currentCharacter,
                    possibleMarkdowns: new Set([currentMarkdown]),
                },
            };
        }
    }

    //
    // Case 2️⃣ 🅱️ - Check if the current character can open a nested element
    // or if it can be part of a nested sequence
    //
    if (currentMarkdown.canContain && currentMarkdown.canContain.length > 0) {
        const possibleNestedSequence: Sequence = {
            type: 'opening',
            value: nestedSequence ? nestedSequence.value + currentCharacter : currentCharacter,
            possibleMarkdowns: new Set(),
        };

        for (const nestedTagName of currentMarkdown.canContain) {
            const possibleNestedMarkdowns = MarkdownsByTagName.get(nestedTagName);
            if (!possibleNestedMarkdowns) {
                // Not supposed to happen - but added for TypeScript to be happy
                warn('MD parser: Unknown tag "' + nestedTagName + '"');
                continue;
            }

            let shouldOpenNestedElement = false;
            let markdownToOpenNestedElement: Markdown | null = null;
            for (const nestedTag of possibleNestedMarkdowns) {
                if (nestedTag.characterChecks.shouldOpen(
                    currentCharacter,
                    previousCharacter,
                    nestedSequence,
                )) {
                    shouldOpenNestedElement = true;
                    markdownToOpenNestedElement = nestedTag;
                    break;
                }
            }

            if (shouldOpenNestedElement && markdownToOpenNestedElement) {
                //
                // IMPORTANT: This is where we create a nested element!
                //
                const nestedElement = markdownToOpenNestedElement.create(
                    currentCharacter,
                    previousCharacter,
                    nestedSequence,
                );

                return {
                    actionPerformed: 'nestedElementCreated',
                    nestedElement,
                    nestedSequence: null,
                    nestedMarkdown: markdownToOpenNestedElement,
                };
            } else {
                if (nestedSequence) {
                    for (const nestedMarkdownCode of nestedSequence.possibleMarkdowns) {
                        if (nestedMarkdownCode.characterChecks.canBePartOfOpeningSequence(currentCharacter,
                            previousCharacter,
                            nestedSequence,
                        )) {
                            possibleNestedSequence.possibleMarkdowns.add(nestedMarkdownCode);
                        }
                    }
                } else {
                    currentMarkdown.canContain.forEach(tagName => {
                        const markdowns = MarkdownsByTagName.get(tagName);
                        if (!markdowns) {
                            // Not supposed to happen - but added for TypeScript to be happy
                            warn('MD parser: Unknown tag "' + tagName + '"');
                            return;
                        }

                        for (const markdown of markdowns) {
                            if (markdown.characterChecks.canStartSequence(currentCharacter, previousCharacter)) {
                                possibleNestedSequence.possibleMarkdowns.add(markdown);
                            }
                        }
                    });
                }
            }
        }

        // If the character can be part of a nested sequence, we stop parsing and return the sequence
        if (possibleNestedSequence.possibleMarkdowns.size > 0) {
            return {
                actionPerformed: 'possibleNestedSequenceFound',
                nestedSequence: possibleNestedSequence,
            };
        }
    }

    // Case 2️⃣ 🆑 - Append the character to the current element
    currentMarkdown.append(currentElement, currentCharacter, previousCharacter);

    return {
        actionPerformed: 'elementUpdated',
    };
};
