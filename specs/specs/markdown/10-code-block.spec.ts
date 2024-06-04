import {beforeEach, describe, expect, it} from 'vitest';
import {createMdStreamRenderer} from '@shared/markdown/stream/streamParser';
import {StandardStreamParserOutput} from '@shared/types/markdown/streamParser';
import {waitForMdStreamToComplete} from '../../utils/wait';

describe('Code Block Markdowns Parser', () => {
    let streamRenderer: StandardStreamParserOutput;
    let rootElement: HTMLElement;

    const renderedCode = (): string | undefined => {
        if (!rootElement || rootElement.children.length === 0) {
            return undefined;
        }

        const codeBlock = rootElement.querySelector('pre');
        if (!codeBlock) {
            return undefined;
        }

        const tempDiv = document.createElement('div');
        tempDiv.append(codeBlock?.cloneNode(true) as any);
        return tempDiv.innerHTML;
    };

    beforeEach(() => {
        rootElement = document.createElement('div');
        streamRenderer = createMdStreamRenderer(rootElement, {
            skipStreamingAnimation: true,
            showCodeBlockCopyButton: false,
        });
    });

    it('should render inside a proper HTML structure', async () => {
        streamRenderer.next('```\nconst a = 1;\n```');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<div class="code-block"><pre><div>const a = 1;\n</div></pre></div>\n');
    });

    it('should render code block at root level', async () => {
        streamRenderer.next('Some code:\n```\nconst a = 1;\n```');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe(
            '<p>Some code:</p>\n<div class="code-block"><pre><div>const a = 1;\n</div></pre></div>\n');
    });

    it('should render code block that follows a heading', async () => {
        streamRenderer.next('# Heading\n```js\nconst a = 1;\n```');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe(
            '<h1>Heading</h1>\n<div class="code-block"><pre data-language="js"><div>const a = 1;\n</div></pre></div>\n');
    });

    it('should render code block followed by a heading', async () => {
        streamRenderer.next('```js\nconst a = 1;\n```\n# Heading');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe(
            '<div class="code-block"><pre data-language="js"><div>const a = 1;\n</div></pre></div>\n<h1>Heading</h1>\n');
    });

    it('should render code block followed by a paragraph', async () => {
        streamRenderer.next('```js\nconst a = 1;\n```\nSome paragraph');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe(
            '<div class="code-block"><pre data-language="js"><div>const a = 1;\n</div></pre></div>\n<p>Some paragraph</p>\n');
    });

    it('should render a 1 line code block without trailing or leading new line', async () => {
        streamRenderer.next('```\nconst a = 1;\n```');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(renderedCode()).toBe('<pre><div>const a = 1;\n</div></pre>');
    });

    it('should render a 1 line code block without multiple leading new lines', async () => {
        streamRenderer.next('```\n\n\nconst a = 1;\n```');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(renderedCode()).toBe('<pre><div>\n\nconst a = 1;\n</div></pre>');
    });

    it('should render a 1 line code block with multiple trailing new lines', async () => {
        streamRenderer.next('```\nconst a = 1;\n\n\n\n```');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(renderedCode()).toBe('<pre><div>const a = 1;\n\n\n</div></pre>');
    });

    it('should render empty lines inside div with white space inside', async () => {
        streamRenderer.next('```\nA\n\nB\n```');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(renderedCode()).toBe('<pre><div>A\n\nB\n</div></pre>');
    });

    it('should not render heading inside a code block', async () => {
        streamRenderer.next('```\n# Heading\n```');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(renderedCode()).toBe('<pre><div># Heading\n</div></pre>');
    });

    it('should render code block with language', async () => {
        streamRenderer.next('```js\nconst a = 1;\n```');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(renderedCode()).toBe('<pre data-language="js"><div>const a = 1;\n</div></pre>');
    });

    it('should not render code block when empty', async () => {
        streamRenderer.next('```js```');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(renderedCode()).toBeUndefined();
    });

    it('should render code block even when empty with new line inside', async () => {
        streamRenderer.next('```js\n```');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(renderedCode()).toBe('<pre data-language="js"><div>\n</div></pre>');
    });
});
