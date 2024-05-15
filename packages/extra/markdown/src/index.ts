import {HighlighterExtension} from '../../../js/core/src';
import {createMdStreamRenderer} from '../../../shared/src/markdown/stream/streamParser';
import {CallbackFunction} from '../../../shared/src/types/callbackFunction';

export type MarkdownStreamParser = {
    next(value: string): void;
    complete(): void;
};

export type MarkdownStreamParserOptions = {
    markdownLinkTarget?: 'blank' | 'self';
    syntaxHighlighter?: HighlighterExtension;
    skipStreamingAnimation?: boolean;
    streamingAnimationSpeed?: number;
    showCodeBlockCopyButton?: boolean;
    onComplete?: CallbackFunction;
};

export const createMarkdownStreamParser = (
    domElement: HTMLElement,
    options?: MarkdownStreamParserOptions,
): MarkdownStreamParser => {
    const nluxMarkdownStreamRenderer = createMdStreamRenderer(
        domElement,
        options?.syntaxHighlighter,
        {
            markdownLinkTarget: options?.markdownLinkTarget,
            showCodeBlockCopyButton: options?.showCodeBlockCopyButton,
            skipStreamingAnimation: options?.skipStreamingAnimation,
            streamingAnimationSpeed: options?.streamingAnimationSpeed,
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
