import {createMdStreamRenderer, StandardStreamParserOutput} from '@nlux/core';
import {waitForMdStreamToComplete, waitForMilliseconds} from '../../utils/wait';

describe('Code Block Markdowns Parser', () => {
    let streamRenderer: StandardStreamParserOutput;
    let rootElement: HTMLElement;

    const renderedCode = (): string | undefined => {
        if (!rootElement || rootElement.children.length === 0) {
            return undefined;
        }

        const codeBlock = rootElement.querySelector('pre');
        const tempDiv = document.createElement('div');
        tempDiv.append(codeBlock.cloneNode(true));
        return tempDiv.innerHTML;
    }

    beforeEach(() => {
        rootElement = document.createElement('div');
        streamRenderer = createMdStreamRenderer(rootElement, undefined, {
            skipAnimation: true,
            skipCopyToClipboardButton: true,
        });
    });

    it('should render inside a proper HTML structure', async () => {
        streamRenderer.next('```\nconst a = 1;\n```');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<div class="code-block"><pre><div>const a = 1;</div></pre></div>');
    });

    it('should render code block at root level', async () => {
        streamRenderer.next('Some code:```\nconst a = 1;\n```');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p>Some code:</p><div class="code-block"><pre><div>const a = 1;</div></pre></div>');
    });

    it('should render code block that follows a heading', async () => {
        streamRenderer.next('# Heading\n```js\nconst a = 1;\n```');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<h1>Heading</h1><div class="code-block"><pre data-language="js"><div>const a = 1;</div></pre></div>');
    });

    it('should render code block followed by a heading', async () => {
        streamRenderer.next('```js\nconst a = 1;\n```\n# Heading');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<div class="code-block"><pre data-language="js"><div>const a = 1;</div></pre></div><h1>Heading</h1>');
    });

    it('should render code block followed by a paragraph', async () => {
        streamRenderer.next('```js\nconst a = 1;\n```\nSome paragraph');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<div class="code-block"><pre data-language="js"><div>const a = 1;</div></pre></div><p>Some paragraph</p>');
    });

    it('should render a 1 line code block without trailing or leading new line', async () => {
        streamRenderer.next('```\nconst a = 1;\n```');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(renderedCode()).toBe('<pre><div>const a = 1;</div></pre>');
    });

    it('should render a 1 line code block without multiple leading new lines', async () => {
        streamRenderer.next('```\n\n\nconst a = 1;\n```');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(renderedCode()).toBe('<pre><div>const a = 1;</div></pre>');
    });

    it('should render a 1 line code block with multiple trailing new lines', async () => {
        streamRenderer.next('```\nconst a = 1;\n\n\n\n```');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(renderedCode()).toBe('<pre><div>const a = 1;</div><div> </div><div> </div></pre>');
    });

    it('should render each line inside a separate div', async () => {
        streamRenderer.next('```\nconst a = 1;  \nconst b = 2;\n```');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(renderedCode()).toBe('<pre><div>const a = 1;  </div><div>const b = 2;</div></pre>');
    });

    it('should render empty lines inside div with white space inside', async () => {
        streamRenderer.next('```\nA\n\nB\n```');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(renderedCode()).toBe('<pre><div>A</div><div> </div><div>B</div></pre>');
    });

    it('should not render heading inside a code block', async () => {
        streamRenderer.next('```\n# Heading\n```');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(renderedCode()).toBe('<pre><div># Heading</div></pre>');
    });

    it('should render code block wihtout language', async () => {
        streamRenderer.next('```js\nconst a = 1;\n```');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(renderedCode()).toBe('<pre data-language="js"><div>const a = 1;</div></pre>');
    });

    it('should render code block even when empty', async () => {
        streamRenderer.next('```js```');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(renderedCode()).toBe('<pre data-language="js"></pre>');
    });

    it('should render code block even when empty with new line inside', async () => {
        streamRenderer.next('```js\n```');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(renderedCode()).toBe('<pre data-language="js"></pre>');
    });
});
