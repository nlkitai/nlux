import {StandardStreamParser} from '../../types/markdown/streamParser';
import {warn} from '../../utils/warn';
import {attachCopyClickListener} from '../copyToClipboard/attachCopyClickListener';
import {parseMdSnapshot} from '../snapshot/snapshotParser';

const defaultDelayInMsBeforeComplete = 2000;
const defaultDelayInMsBetweenBufferChecks = 8;
const endOfStreamChar = '\n';

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
            const childToCommit = wipContainer.firstChild;
            if (childToCommit instanceof HTMLElement) {
                attachCopyClickListener(childToCommit);
            }

            wipContainer.before(childToCommit);
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

    const delayBetweenBufferChecks = (
        !options?.skipStreamingAnimation && options?.streamingAnimationSpeed && options.streamingAnimationSpeed >= 0
    ) ? options.streamingAnimationSpeed : (options?.skipStreamingAnimation ? 0 : defaultDelayInMsBetweenBufferChecks);

    const parsingContext: {
        timeSinceLastProcessing: number;
        currentMarkdown: string;
        previousHtml: string | undefined;
    } = {
        timeSinceLastProcessing: new Date().getTime(),
        currentMarkdown: '',
        previousHtml: undefined,
    };

    let parsingInterval: number | undefined = setInterval(() => {
        const nowTime = new Date().getTime();
        const shouldAutomaticallyCompleteAfterDelay = options?.waitTimeBeforeStreamCompletion !== 'never';
        if (buffer.length === 0 && shouldAutomaticallyCompleteAfterDelay) {
            const delayBeforeCompleteParsing = (typeof options?.waitTimeBeforeStreamCompletion === 'number')
                ? options.waitTimeBeforeStreamCompletion : defaultDelayInMsBeforeComplete;

            if (streamIsComplete || nowTime - parsingContext.timeSinceLastProcessing > delayBeforeCompleteParsing) {
                completeParsing();
            }

            return;
        }

        parsingContext.timeSinceLastProcessing = nowTime;
        const chunk = buffer.shift();
        if (chunk === undefined || typeof chunk !== 'string') {
            return;
        }

        scheduler(() => {
            // We should only parse the last chunk (in it release context) instead of the whole text
            // In order to do that, we need to distinguish between:
            //   - We will have WIP text to being parsed, and may be incomplete (example: `# Hello, `)
            //   - Text that is committed to the DOM and will not change (example: `# Hello World!\n\n`)

            // Append the new chunk to the raw text and parse
            const markdownToParse = parsingContext.currentMarkdown + chunk;
            const parsedHtml = parseMdSnapshot(markdownToParse, options).trim();

            if (typeof parsedHtml !== 'string') {
                // Remove the last chunk if parsing failed
                parsingContext.currentMarkdown = parsingContext.currentMarkdown.slice(0, -chunk.length);
                warn('Markdown parsing failed');
                return;
            }

            if (
                parsingContext.previousHtml &&
                parsedHtml.length > parsingContext.previousHtml.length &&
                parsedHtml.startsWith(parsingContext.previousHtml)
            ) {
                // Case 1: No changes to the previous HTML — And new HTML added on top of it
                // Which means the new chunk added new HTML content outside the last parsed markdown
                // Which means that the last parsed markdown is complete and should be committed to the DOM
                // Commit the last parsed content to the DOM

                commitWipContent();

                // Extract new HTML and insert it into WIP container
                const currentHtml = parsedHtml.slice(parsingContext.previousHtml.length).trim();
                wipContainer.innerHTML = options?.htmlSanitizer ? options.htmlSanitizer(currentHtml) : currentHtml;

                // Focus on everything that is new
                parsingContext.currentMarkdown = chunk;
                parsingContext.previousHtml = undefined;
            } else {
                // Case 2: Changes to the previous HTML
                // This means that new chunk goes inside previous HTML and no root level changes

                // Append the new chunk to the current markdown
                wipContainer.innerHTML = options?.htmlSanitizer ? options.htmlSanitizer(parsedHtml) : parsedHtml;

                // Update the current markdown and previous HTML for the next iteration
                parsingContext.currentMarkdown = markdownToParse;
                parsingContext.previousHtml = parsedHtml;
            }
        });
    }, delayBetweenBufferChecks) as unknown as number;

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
            buffer.push(endOfStreamChar);
            streamIsComplete = true;
        },
        cancel: () => {
            if (parsingInterval) {
                clearInterval(parsingInterval);
                parsingInterval = undefined;
            }

            streamIsComplete = true;
            wipContainer.remove();
        },
        error: () => {
            // No special handling for errors
            // Just complete the stream
            streamIsComplete = true;
        },
    };
};
