import {StandardStreamParser, StreamParser} from '../../types/markdown/streamParser';
import {RootProcessor} from './processors/Root';

const characterProcessingDelayInMs = 10;

// If no characters are processed for 500ms, we consider the stream complete
const numberOfEmptyChecksBeforeCompletion = Math.ceil(200 / characterProcessingDelayInMs);

let chartersProcessed = 0;

export const createMdStreamRenderer: StandardStreamParser = (root: HTMLElement, syntaxHighlighter, options) => {
    const {
        skipAnimation,
        skipCopyToClipboardButton,
    } = options || {};
    const rootMarkdownProcessor = new RootProcessor(
        root,
        undefined,
        {
            syntaxHighlighter,
            skipCopyToClipboardButton,
        }
    );

    const charactersQueue: string[] = [];
    const onCompletionCallbacks: Set<Function> = new Set();

    let numberOfChecksWithEmptyCharactersQueue = 0;
    let isProcessing = false;
    let yielded = false;

    const processCharactersQueue = () => {
        if (
            charactersQueue.length === 0 &&
            numberOfChecksWithEmptyCharactersQueue < numberOfEmptyChecksBeforeCompletion
        ) {
            numberOfChecksWithEmptyCharactersQueue += 1;
            setTimeout(processCharactersQueue, skipAnimation ? 0 : characterProcessingDelayInMs);
            return;
        }

        if (
            charactersQueue.length === 0 &&
            numberOfChecksWithEmptyCharactersQueue === numberOfEmptyChecksBeforeCompletion
        ) {
            isProcessing = false;

            if (yielded) {
                rootMarkdownProcessor.processCharacter('\n');
                rootMarkdownProcessor.complete();
                rootMarkdownProcessor.yield();

                onCompletionCallbacks.forEach(callback => callback());
                onCompletionCallbacks.clear();
            }

            return;
        }

        if (charactersQueue.length > 0) {
            const character = charactersQueue.shift();
            if (character) {
                rootMarkdownProcessor.processCharacter(character);
            }

            isProcessing = true;
            chartersProcessed += 1;
            numberOfChecksWithEmptyCharactersQueue = 0;
        }

        setTimeout(processCharactersQueue, skipAnimation ? 0 : characterProcessingDelayInMs);
    };

    return {
        next: (chunk: string) => {
            if (!chunk) {
                return;
            }

            for (let i = 0; i < chunk.length; i++) {
                charactersQueue.push(chunk[i]);
            }

            if (!isProcessing) {
                processCharactersQueue();
            }
        },
        complete: () => {
            yielded = true;
        },
        onComplete: (completeCallback: Function) => {
            if (!yielded) {
                onCompletionCallbacks.add(completeCallback);
            }
        }
    };
};
