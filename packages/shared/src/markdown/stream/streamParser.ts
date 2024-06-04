import {StandardStreamParser} from '../../types/markdown/streamParser';
import {marked} from '../snapshot/marked/marked';
import {warn} from '../../utils/warn';

export const createMdStreamRenderer: StandardStreamParser = (
    root: HTMLElement,
    options,
) => {
    let isComplete = false;
    let completeStreamTimer = setTimeout(() => {
        isComplete = true;
        options?.onComplete?.();
    }, 2000);

    const {
        htmlSanitizer,
        onComplete,
    } = options || {};

    let rawText = '';

    return {
        next: (chunk: string) => {
            if (isComplete) {
                console.warn('Stream is closed. Chunk will be ignored');
                return;
            }

            // Set the stream to complete after 2 seconds of no new chunks
            clearTimeout(completeStreamTimer);
            completeStreamTimer = setTimeout(() => {
                isComplete = true;
                options?.onComplete?.();
            }, 2000);

            // Append the new chunk to the raw text and parse
            rawText += chunk;
            const parsedMarkdown = marked(rawText, {
                async: false,
                gfm: true,
                breaks: true,
            });

            if (typeof parsedMarkdown !== 'string') {
                // Remove the last chunk if parsing failed
                rawText = rawText.slice(0, -chunk.length);
                warn('Markdown parsing failed');
                return;
            }

            // Sanitize the HTML and update the root element
            root.innerHTML = htmlSanitizer ? htmlSanitizer(parsedMarkdown) : parsedMarkdown;
        },
        complete: () => {
            onComplete?.();
        },
        error: () => {
            // No error handling for now
        },
    };
};
