import {IObserver} from '../../core/bus/observer';
import {warn} from '../../x/debug';
import {parse} from './parser';
import {Sequence} from './tag';

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

export const createMdStreamRenderer = (root: HTMLElement): IObserver<string> => {
    let isRendering = true;
    let currentElement: HTMLElement | null = null;
    let currentSequence: Sequence | null = null;
    let previousCharacter: string | null = null;

    return {
        next: (chunk: string) => {
            if (!isRendering) {
                warn('MD stream renderer is not rendering anymore! Chunk will be ignored.');
                return;
            }

            // Parse chunk character by character
            for (let i = 0; i < chunk.length; i++) {
                const character = chunk[i];
                const result = parse(
                    currentElement,
                    currentSequence,
                    previousCharacter,
                    character,
                );

                previousCharacter = character;

                if (result.actionPerformed === 'none') {
                    continue;
                }

                if (result.actionPerformed === 'elementCreated') {
                    if (result.element) {
                        currentElement = result.element;
                        root.append(currentElement);
                    } else {
                        warn('Inconsistent MD parser state: elementCreated without element returned');
                    }

                    currentSequence = null;
                    continue;
                }

                if (result.actionPerformed === 'elementUpdated') {
                    if (result.sequence) {
                        currentSequence = result.sequence;
                    }

                    if (result.element) {
                        currentElement = result.element;
                    } else {
                        warn('Inconsistent MD parser state: elementUpdated without element returned');
                    }
                    continue;
                }

                if (result.actionPerformed === 'elementClosed') {
                    if (currentElement) {
                        currentElement.innerHTML = currentElement.innerHTML.trim();
                    }

                    currentElement = null;
                    currentSequence = result.sequence;
                    continue;
                }

                if (result.actionPerformed === 'possibleSequenceFound') {
                    if (result.sequence) {
                        currentSequence = result.sequence;
                    } else {
                        warn('Inconsistent MD parser state: possibleSequenceFound without sequence returned');
                    }
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
