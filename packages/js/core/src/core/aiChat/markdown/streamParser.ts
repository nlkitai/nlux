import {StandardStreamParser} from '../../../types/markdown/streamParser';
import {RootProcessor} from './processors/Root';

export const markdownDefaultStreamingAnimationSpeed = 10; // We render a new character every 10ms (if available)

let chartersProcessed = 0;

export const createMdStreamRenderer: StandardStreamParser = (
    root: HTMLElement,
    syntaxHighlighter,
    options,
) => {
    const {
        streamingAnimationSpeed = markdownDefaultStreamingAnimationSpeed,
        skipAnimation = false,
        skipCopyToClipboardButton = false,
        openLinksInNewWindow = false,
    } = options || {};
    const rootMarkdownProcessor = new RootProcessor(
        root,
        undefined,
        {
            syntaxHighlighter,
            skipCopyToClipboardButton,
            openLinksInNewWindow,
        },
    );

    const charactersQueue: string[] = [];
    const onCompletionCallbacks: Set<Function> = new Set();

    let numberOfChecksWithEmptyCharactersQueue = 0;
    let isProcessing = false;
    let yielded = false;

    // skipAnimation => 0 milliseconds between characters (no animation)
    // streamingAnimationSpeed => speed value that cannot be lower than 0
    const streamingAnimationSpeedToUse = skipAnimation ? 0 : Math.max(streamingAnimationSpeed, 0);

    // If no characters are processed for 500ms, we consider the stream complete
    const numberOfEmptyChecksBeforeCompletion = Math.ceil(200 / markdownDefaultStreamingAnimationSpeed);

    const processCharactersQueue = () => {
        if (
            charactersQueue.length === 0 &&
            numberOfChecksWithEmptyCharactersQueue < numberOfEmptyChecksBeforeCompletion
        ) {
            numberOfChecksWithEmptyCharactersQueue += 1;
            setTimeout(processCharactersQueue, streamingAnimationSpeedToUse);
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

        setTimeout(
            processCharactersQueue,
            streamingAnimationSpeedToUse,
        );
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
        },
    };
};
