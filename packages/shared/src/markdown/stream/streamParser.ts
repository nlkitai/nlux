import {StandardStreamParser} from '../../types/markdown/streamParser';
import {warn} from '../../utils/warn';
import {parseMdSnapshot} from '../snapshot/snapshotParser';

const delayBeforeComplete = 2000;

export const createMdStreamRenderer: StandardStreamParser = (
    root: HTMLElement,
    options,
) => {
    let isComplete = false;
    const {onComplete, htmlSanitizer} = options || {};

    //
    // Container for markdown being parsed and that can be updated
    //
    const wipContainer = document.createElement('div');
    wipContainer.classList.add('md-in-progress');
    root.appendChild(wipContainer);

    const commitWipContent = () => {
        while (wipContainer.firstChild) {
            root.appendChild(wipContainer.firstChild);
        }
    };

    const completeParsing = () => {
        isComplete = true;
        commitWipContent();
        wipContainer.remove();
        onComplete?.();
    };

    const markAsComplete = () => setTimeout(completeParsing, delayBeforeComplete);

    let currentMarkdown = '';
    let previousHtml: string | undefined = undefined;
    let completeStreamTimer = markAsComplete();

    return {
        next: (chunk: string) => {
            if (isComplete) {
                warn('Stream is closed. Chunk will be ignored');
                return;
            }

            // Set the stream to complete after 2 seconds of no new chunks
            clearTimeout(completeStreamTimer);
            completeStreamTimer = markAsComplete();

            // We should only parse the last chunk (in it release context) instead of the whole text
            // In order to do that, we need to distinguish between:
            //   - We will have WIP text to being parsed, and may be incomplete (example: `# Hello, `)
            //   - Text that is committed to the DOM and will not change (example: `# Hello World!\n\n`)

            // Append the new chunk to the raw text and parse
            const markdownToParse = currentMarkdown + chunk;
            const parsedHtml = parseMdSnapshot(markdownToParse, options);
            if (typeof parsedHtml !== 'string') {
                // Remove the last chunk if parsing failed
                currentMarkdown = currentMarkdown.slice(0, -chunk.length);
                warn('Markdown parsing failed');
                return;
            }

            if (previousHtml && parsedHtml.length > previousHtml.length && parsedHtml.startsWith(previousHtml)) {
                // Case 1: No changes to the previous HTML — And new HTML added on top of it
                // Which means the new chunk added new HTML content outside the last parsed markdown
                // Which means that the last parsed markdown is complete and should be committed to the DOM
                // Commit the last parsed content to the DOM

                for (let i = 0; i < wipContainer.children.length; i++) {
                    wipContainer.insertAdjacentElement('beforebegin', wipContainer.children[i]);
                }

                // Extract new HTML and insert it into WIP container
                const currentHtml = parsedHtml.slice(previousHtml.length);
                const trimmedHtml = currentHtml.trim();
                wipContainer.innerHTML = htmlSanitizer ? htmlSanitizer(trimmedHtml) : trimmedHtml;

                // Focus on everything that is new
                currentMarkdown = chunk;
                previousHtml = undefined;
            } else {
                // Case 2: Changes to the previous HTML
                // This means that new chunk goes inside previous HTML and no root level changes

                // Append the new chunk to the current markdown
                const trimmedHtml = parsedHtml.trim();
                wipContainer.innerHTML = htmlSanitizer ? htmlSanitizer(trimmedHtml) : trimmedHtml;

                // Update the current markdown and previous HTML for the next iteration
                currentMarkdown = markdownToParse;
                previousHtml = parsedHtml;
            }
        },
        complete: () => {
            completeParsing();
        },
        error: () => {
            // No error handling for now
        },
    };
};
