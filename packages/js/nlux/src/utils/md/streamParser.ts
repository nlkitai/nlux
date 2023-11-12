import {IObserver} from '../../core/bus/observer';
import {warn} from '../../x/debug';
import {Markdown, Sequence} from './markdown';
import {parse} from './parser';

//
// Parsers of a stream of markdown strings.
// Renders a stream of markdown strings into a DOM element as they are received.
//
// Requirements:
// * The DOM tree should be updated live as the stream is received.
// * We should render markdown as it's received, not wait for the whole tag to be received.
// * We should handle the possibility of a tag being split across multiple chunks.
// * We should handle embedded tags, example: **bold `bold code` bold**
// * We should handle embedded tags that are split across multiple chunks.
// * We should handle escape sequences.
// * Text is always rendered inside a <p> tag.
// * Code is rendered inside a <code> tag or <pre> tag.
// * We only implement basic markdown syntax listed here: https://www.markdownguide.org/basic-syntax/

// * Example of streamed markdown:
// - Chunk 1: "#" => Nothing rendered in the screen
// - Chunk 2: "#" => Nothing rendered in the screen
// - Chunk 3: " " => Then we realise that this is a header, so we render an empty H2 tag
// - Chunk 4: "T" => Render "T" inside the H2 tag
// - Chunks 5-19: "his is a header" => Render "This is a header" inside the H2 tag
// - Chunk 20: "\n" => Nothing rendered in the screen
// - Chunk 21: "Some text" => Render "Some text" inside a P tag

// Algorithm:
// Each chunk is transformed into a stream of characters. We then process each character as it's received.
// Each character can have one of the following roles:
// * Text: The character is rendered as is.
// * Tag: The character can be part of a tag (depending on context), but it can also be rendered as is.
// * Escape: The character is part of an escape sequence, we render the escaped character.

export const createMdStreamRenderer = (
    root: HTMLElement,
    nestedMarkdownFromParent: Markdown | undefined = undefined,
): IObserver<string> => {
    let isRendering = true;
    let previousCharacter: string | null = null;

    let currentElement: HTMLElement | null = nestedMarkdownFromParent ? root : null;
    let currentMarkdown: Markdown | null = nestedMarkdownFromParent || null;
    let currentSequence: Sequence | null = null;

    let nestedElement: HTMLElement | null = null;
    let nestedMarkdown: Markdown | null = null;
    let nestedSequence: Sequence | null = null;
    let nestedElementParser: IObserver<string> | null = null;

    return {
        next: (chunk: string) => {
            if (!isRendering) {
                warn('MD stream renderer is not rendering anymore! Chunk will be ignored.');
                return;
            }

            // Parse chunk character by character
            for (let i = 0; i < chunk.length; i++) {
                const character = chunk[i];

                //
                // Case 1️⃣ - If there is a nested element.
                //
                // We check if the character can be part of the closing sequence of the nested element.
                // Otherwise we pass the character to the nested element.
                //
                if (nestedElement) {
                    if (!nestedElementParser || !nestedMarkdown) {
                        warn(
                            'Inconsistent MD parser state: nestedElement without nestedElementParser or nestedMarkdown '
                            + 'or nestedSequence',
                        );
                        nestedElement = null;
                        continue;
                    }

                    // Important: The character results in a closing of the nested element.
                    if (nestedMarkdown.characterChecks.shouldClose(
                        character,
                        previousCharacter,
                        nestedSequence,
                    )) {
                        if (nestedElementParser.complete) {
                            nestedElementParser.complete();
                        }

                        nestedElement = null;
                        nestedMarkdown = null;
                        nestedSequence = null;
                        nestedElementParser = null;

                        // Important: We do not 'continue' here, as the closing character should be processed
                        // as part of the current element.
                        // NO continue;
                    } else {
                        if (nestedSequence) {
                            if (nestedMarkdown.characterChecks.canBePartOfClosingSequence(
                                character,
                                previousCharacter,
                                nestedSequence,
                            )) {
                                // We update the closing sequence.
                                nestedSequence.value += character;
                                previousCharacter = character;
                                continue;
                            } else {
                                // The case when the nested sequence won't result is a closing sequence -
                                // We stream the sequence and the character to the nested element.
                                for (let j = 0; j < nestedSequence.value.length; j++) {
                                    nestedElementParser.next(nestedSequence.value[j]);
                                    previousCharacter = nestedSequence.value[j];
                                }

                                nestedElementParser.next(character);
                                previousCharacter = character;
                                nestedSequence = null;
                                continue;
                            }
                        } else {
                            if (nestedMarkdown.characterChecks.canStartClosingSequence(character, previousCharacter)) {
                                nestedSequence = {
                                    type: 'closing',
                                    value: character,
                                    possibleMarkdowns: new Set([nestedMarkdown]),
                                };
                                previousCharacter = character;
                            } else {
                                // There is no nested sequence, we stream the character to the nested element.
                                nestedElementParser.next(character);
                                previousCharacter = character;
                                continue;
                            }
                        }
                    }
                }

                // A second check - as the nested element might have been closed in the previous step.
                if (nestedElement) {
                    continue;
                }

                //
                // Case 2️⃣ - If there is no current element, we pass the character to the parser.
                //
                const result = parse(
                    currentElement,
                    currentMarkdown,
                    currentSequence,
                    nestedSequence,
                    previousCharacter,
                    character,
                );

                previousCharacter = character;

                if (result.actionPerformed === 'none') {
                    continue;
                }

                if (result.actionPerformed === 'elementCreated') {
                    currentElement = result.element;
                    currentMarkdown = result.markdown;
                    nestedSequence = result.nestedSequence;

                    root.append(currentElement);
                    currentSequence = null;

                    continue;
                }

                if (result.actionPerformed === 'elementUpdated') {
                    continue;
                }

                if (result.actionPerformed === 'elementClosed') {
                    if (currentElement) {
                        currentElement.innerHTML = currentElement.innerHTML.trim();
                    }

                    currentElement = null;
                    currentMarkdown = null;

                    // The character can simultaneously close an element and be part of a new element.
                    // Example: # after \n closes the previous paragraph and can be part of a new header.
                    currentSequence = result.newSequence;
                    continue;
                }

                if (result.actionPerformed === 'possibleSequenceFound') {
                    currentSequence = result.sequence;
                    nestedSequence = null;
                    continue;
                }

                if (result.actionPerformed === 'possibleNestedSequenceFound') {
                    nestedSequence = result.nestedSequence;
                    currentSequence = null;
                    continue;
                }

                if (result.actionPerformed === 'nestedElementCreated') {
                    nestedSequence = null;
                    currentSequence = null;

                    if (!currentElement) {
                        warn('Inconsistent MD parser state: nestedElementCreated without currentElement');
                        continue;
                    }

                    nestedElement = result.nestedElement;
                    nestedMarkdown = result.nestedMarkdown;
                    nestedElementParser = createMdStreamRenderer(
                        nestedElement,
                        nestedMarkdown,
                    );

                    currentElement.append(nestedElement);
                    nestedElementParser.next(character);

                    continue;
                }
            }
        },
        error: (error: Error) => {
            isRendering = false;
            warn(error);
        },
        complete: () => {
            if (currentElement) {
                currentElement.innerHTML = currentElement.innerHTML.trim();
            }

            if (currentSequence && currentSequence.type === 'opening') {
                const newElement = document.createElement('p');
                newElement.append(currentSequence.value);
                root.append(newElement);
            }

            isRendering = false;
            currentElement = null;
            currentSequence = null;
            previousCharacter = null;
        },
    };
};
