import {createMdStreamRenderer, HighlighterExtension} from '../../../js/core/src';

export type MarkdownStreamParser = {
    next(value: string): void;
    complete(): void;
};

export type MarkdownStreamParserOptions = {
    syntaxHighlighter?: HighlighterExtension;
    skipAnimation?: boolean;
    streamingAnimationSpeed?: number;
    onComplete?: Function;
};

export const createMarkdownStreamParser = (
    domElement: HTMLElement,
    options?: MarkdownStreamParserOptions,
): MarkdownStreamParser => {
    const nluxMarkdownStreamRenderer = createMdStreamRenderer(
        domElement,
        options?.syntaxHighlighter,
        {
            skipAnimation: options?.skipAnimation,
            streamingAnimationSpeed: options?.streamingAnimationSpeed,
            skipCopyToClipboardButton: true,
        },
    );

    return {
        next(value: string) {
            nluxMarkdownStreamRenderer.next(value);
        },
        complete() {
            if (nluxMarkdownStreamRenderer.complete) {
                nluxMarkdownStreamRenderer.complete();
            }
        },
    };
};
