import {StandardStreamParser} from '../../types/markdown/streamParser';
import {warn} from '../../utils/warn';
import {parseMdSnapshot} from '../snapshot/snapshotParser';
import {attachCopyClickListener} from '../copyToClipboard/attachCopyClickListener';

export const createMdStreamRenderer: StandardStreamParser = (
    root: HTMLElement,
    options,
) => {
    let rawText = '';
    let isComplete = false;
    let completeStreamTimer = setTimeout(() => {
        isComplete = true;
        options?.onComplete?.();
    }, 2000);

    const {onComplete} = options || {};

    return {
        next: (chunk: string) => {
            if (isComplete) {
                warn('Stream is closed. Chunk will be ignored');
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

            //
            // TODO - Important performance optimization
            //
            // We should only parse the last chunk (in it release context) instead of the whole text
            // In order to do that, we need to distinguish between:
            //   - We will have WIP text to being parsed, and may be incomplete (example: `# Hello, `)
            //   - Text that is committed to the DOM and will not change (example: `# Hello World!\n\n`)
            //
            // We need to implement logic to handle the WIP text
            //
            const parsedMarkdown = parseMdSnapshot(rawText, options);

            if (typeof parsedMarkdown !== 'string') {
                // Remove the last chunk if parsing failed
                rawText = rawText.slice(0, -chunk.length);
                warn('Markdown parsing failed');
                return;
            }

            // Sanitize the HTML and update the root element
            root.innerHTML = options?.htmlSanitizer ? options.htmlSanitizer(parsedMarkdown) : parsedMarkdown;
            attachCopyClickListener(root);
        },
        complete: () => {
            onComplete?.();
        },
        error: () => {
            // No error handling for now
        },
    };
};
