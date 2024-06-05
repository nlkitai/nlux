import {StandardStreamParser} from '../../types/markdown/streamParser';
import {warn} from '../../utils/warn';
import {parseMdSnapshot} from '../snapshot/snapshotParser';

const defaultDelayInMsBeforeComplete = 2000;
const defaultDelayInMsBetweenBufferChecks = 2;

const getScheduler = (type: 'timeout' | 'animationFrame') => {
    if (type === 'timeout') {
        return (callback: () => void) => setTimeout(callback, 0);
    }

    return (callback: () => void) => requestAnimationFrame(callback);
};

export const createMdStreamRenderer: StandardStreamParser = (
    root: HTMLElement,
    options,
) => {
    let streamIsComplete = false;

    const letterByLetter = true;
    const {onComplete} = options || {};

    //
    // Buffer to store the chunks of markdown to be parsed
    // Scheduler to control the speed of the streaming animation
    //
    const buffer: string[] = [];
    const scheduler = getScheduler(
        options?.skipStreamingAnimation ? 'timeout' : 'animationFrame',
    );

    //
    // Container for markdown being parsed and that can be updated
    //
    const wipContainer = document.createElement('div');
    wipContainer.classList.add('md-in-progress');
    root.append(wipContainer);

    //
    // Functions to commit the WIP content to the DOM
    // And to complete the parsing
    //
    const commitWipContent = () => {
        while (wipContainer.firstChild) {
            wipContainer.before(wipContainer.firstChild);
        }
    };

    const completeParsing = () => {
        streamIsComplete = true;
        if (parsingInterval) {
            clearInterval(parsingInterval);
            parsingInterval = undefined;
        }

        commitWipContent();
        wipContainer.remove();
        onComplete?.();
    };

    let timeSinceLastProcessing: number | undefined = undefined;
    let currentMarkdown = '';
    let previousHtml: string | undefined = undefined;

    const parsingIntervalDelay = (
        !options?.skipStreamingAnimation && options?.streamingAnimationSpeed && options.streamingAnimationSpeed >= 0
    ) ? options.streamingAnimationSpeed : defaultDelayInMsBetweenBufferChecks;

    let parsingInterval: number | undefined = setInterval(() => {
        const nowTime = new Date().getTime();
        if (buffer.length === 0) {
            if (
                streamIsComplete
                || (timeSinceLastProcessing && nowTime - timeSinceLastProcessing > defaultDelayInMsBeforeComplete)
            ) {
                completeParsing();
            }

            return;
        }

        timeSinceLastProcessing = nowTime;
        const chunk = buffer.shift();
        if (!chunk) {
            return;
        }

        scheduler(() => {
            // We should only parse the last chunk (in it release context) instead of the whole text
            // In order to do that, we need to distinguish between:
            //   - We will have WIP text to being parsed, and may be incomplete (example: `# Hello, `)
            //   - Text that is committed to the DOM and will not change (example: `# Hello World!\n\n`)

            // Append the new chunk to the raw text and parse
            const markdownToParse = currentMarkdown + chunk;
            const parsedHtml = parseMdSnapshot(markdownToParse, options).trim();

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

                while (wipContainer.children.length > 0) {
                    wipContainer.before(wipContainer.children[0]);
                }

                // Extract new HTML and insert it into WIP container
                const currentHtml = parsedHtml.slice(previousHtml.length).trim();
                wipContainer.innerHTML = options?.htmlSanitizer ? options.htmlSanitizer(currentHtml) : currentHtml;

                // Focus on everything that is new
                currentMarkdown = chunk;
                previousHtml = undefined;
            } else {
                // Case 2: Changes to the previous HTML
                // This means that new chunk goes inside previous HTML and no root level changes

                // Append the new chunk to the current markdown
                wipContainer.innerHTML = options?.htmlSanitizer ? options.htmlSanitizer(parsedHtml) : parsedHtml;

                // Update the current markdown and previous HTML for the next iteration
                currentMarkdown = markdownToParse;
                previousHtml = parsedHtml;
            }
        });
    }, parsingIntervalDelay) as unknown as number;

    return {
        next: (chunk: string) => {
            if (streamIsComplete) {
                warn('Stream is already complete. No more chunks can be added');
                return;
            }

            if (letterByLetter) {
                for (const char of chunk) {
                    buffer.push(char);
                }
            } else {
                buffer.push(chunk);
            }
        },
        complete: () => {
            streamIsComplete = true;
        },
        error: () => {
            // No error handling for now
        },
    };
};
