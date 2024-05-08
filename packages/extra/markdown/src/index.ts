import {HighlighterExtension} from '../../../js/core/src';
import {createMdStreamRenderer} from '../../../shared/src/markdown/stream/streamParser';

export type MarkdownStreamParser = {
    next(value: string): void;
    complete(): void;
};

export type MarkdownStreamParserOptions = {
    openLinksInNewWindow?: boolean;
    syntaxHighlighter?: HighlighterExtension;
    skipStreamingAnimation?: boolean;
    streamingAnimationSpeed?: number;
    showCodeBlockCopyButton?: boolean;
    onComplete?: Function;
};

export type MarkdownStreamParserConfigOption = keyof Omit<MarkdownStreamParserOptions, 'onComplete'>;

export const createMarkdownStreamParser = (
    domElement: HTMLElement,
    options?: MarkdownStreamParserOptions,
): MarkdownStreamParser => {
    const nluxMarkdownStreamRenderer = createMdStreamRenderer(
        domElement,
        options?.syntaxHighlighter,
        {
            openLinksInNewWindow: options?.openLinksInNewWindow,
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
