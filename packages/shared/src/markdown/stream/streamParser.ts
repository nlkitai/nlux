import {StandardStreamParser} from '../../types/markdown/streamParser';
import {RootProcessor} from './processors/Root';

export const markdownDefaultStreamingAnimationSpeed = 10; // We render a new character every 10ms (if available)

export const createMdStreamRenderer: StandardStreamParser = (
    root: HTMLElement,
    syntaxHighlighter,
    options,
) => {
    const {
        streamingAnimationSpeed = markdownDefaultStreamingAnimationSpeed,
        markdownLinkTarget,
        showCodeBlockCopyButton,
        skipStreamingAnimation = false,
        onComplete,
    } = options || {};
    const rootMarkdownProcessor = new RootProcessor(
        root,
        undefined,
        {
            syntaxHighlighter,
            markdownLinkTarget,
            showCodeBlockCopyButton,
        },
    );

    const charactersQueue: string[] = [];

    let numberOfChecksWithEmptyCharactersQueue = 0;
    let completeStreamCalledByUser = false;
    let status: 'idle' | 'processing' | 'waitingForMoreCharacters' | 'closed' = 'idle';

    // skipStreamingAnimation => 0 milliseconds between characters (no animation)
    // streamingAnimationSpeed => speed value that cannot be lower than 0
    const streamingAnimationSpeedToUse = skipStreamingAnimation ? 0 : Math.max(streamingAnimationSpeed, 0);

    // If no characters are processed for 2 seconds, we consider the stream complete and we close it.
    // Even if the user did not call the complete() method, we close the stream after 2 seconds.
    // A closed stream will not accept any more characters.
    const delayInMsBeforeClosingTheStream = 2000;
    const delayBetweenChecksBeforeCompletion = streamingAnimationSpeed > 0 ? streamingAnimationSpeed : 20;
    const numberOfEmptyChecksBeforeCompletion = Math.ceil(
        delayInMsBeforeClosingTheStream / delayBetweenChecksBeforeCompletion,
    );

    const processCharactersQueue = () => {

        // We do not process any more characters if the stream is closed.
        if (status === 'closed') {
            return;
        }

        if (status === 'idle') {
            // We are starting to process characters, and we update the status accordingly.
            status = 'processing';
        }

        //
        // Here we know that status is either 'processing' or 'waitingForMoreCharacters'.
        //

        //
        // We only close the stream and stop accepting more characters if the queue is empty AND
        // if we have waited for several additional checks ( numberOfEmptyChecksBeforeCompletion )
        // to make sure we are not closing the stream too early.
        //
        if (charactersQueue.length === 0) {
            const shouldWaitForMoreCharacters = (
                completeStreamCalledByUser === false &&
                numberOfChecksWithEmptyCharactersQueue < numberOfEmptyChecksBeforeCompletion
            );

            if (shouldWaitForMoreCharacters) {
                //
                // We wait for more characters to be added to the queue
                //
                status = 'waitingForMoreCharacters';
                numberOfChecksWithEmptyCharactersQueue += 1;
                setTimeout(processCharactersQueue, delayBetweenChecksBeforeCompletion);
            } else {
                //
                // We close the stream and call the onComplete() callback
                //
                rootMarkdownProcessor.processCharacter('\n');
                rootMarkdownProcessor.complete();
                rootMarkdownProcessor.yield();

                status = 'closed';
                onComplete?.();
            }

            return;
        }

        //
        // Queue is not empty, we process the next character
        //
        status = 'processing';
        numberOfChecksWithEmptyCharactersQueue = 0;

        const character = charactersQueue.shift();
        if (character) {
            rootMarkdownProcessor.processCharacter(character);
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

            // Trigger initial processing
            if (status === 'idle') {
                processCharactersQueue();
            }
        },
        complete: () => {
            completeStreamCalledByUser = true;
        },
        error: () => {
            // No error handling for now
        },
    };
};
