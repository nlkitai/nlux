import {highlighter} from '@nlux/highlighter';
import {beforeEach, describe, expect, it} from 'vitest';
import {createMdStreamRenderer} from '@shared/markdown/stream/streamParser';
import {StandardStreamParserOutput} from '@shared/types/markdown/streamParser';
import {waitForMdStreamToComplete} from '../../utils/wait';

describe('Code Block Markdown Parser With Syntax Highlighter', () => {
    let streamRenderer: StandardStreamParserOutput;
    let rootElement: HTMLElement;

    beforeEach(() => {
        rootElement = document.createElement('div');
        streamRenderer = createMdStreamRenderer(rootElement, {
            syntaxHighlighter: highlighter,
            skipStreamingAnimation: true,
            streamingAnimationSpeed: 0,
            showCodeBlockCopyButton: false,
        });
    });

    it('should highlight code block with language', async () => {
        streamRenderer.next('```js\nconst a = 1;\n```');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe(
            '<div class="code-block"><pre data-language="js" class="highlighter-dark"><div><span class="hljs-keyword">const</span> a = <span class="hljs-number">1</span>;\n</div></pre></div>',
        );
    });

    it('should extract language from code block and add to data attribute', async () => {
        streamRenderer.next('```js\nconst a = 1;\n```');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe(
            '<div class="code-block"><pre data-language="js" class="highlighter-dark"><div><span class="hljs-keyword">const</span> a = <span class="hljs-number">1</span>;\n</div></pre></div>',
        );
    });

    it('should not render copy to clipboard button when option is set', async () => {
        streamRenderer = createMdStreamRenderer(rootElement, {
            syntaxHighlighter: highlighter,
            skipStreamingAnimation: true,
            streamingAnimationSpeed: 0,
            showCodeBlockCopyButton: false,
        });

        streamRenderer.next('```js\nconst a = 1;\n```');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.querySelector('.nlux-comp-copyButton')).toBeFalsy();
    });

    it('should render copy to clipboard button when option is set', async () => {
        streamRenderer = createMdStreamRenderer(rootElement, {
            syntaxHighlighter: highlighter,
            skipStreamingAnimation: true,
            streamingAnimationSpeed: 0,
            showCodeBlockCopyButton: true,
        });

        streamRenderer.next('```js\nconst a = 1;\n```');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.querySelector('.nlux-comp-copyButton')).toBeTruthy();
    });
});
