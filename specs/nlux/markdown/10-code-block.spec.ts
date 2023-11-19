import {createMdStreamRenderer, IObserver} from '@nlux/nlux';
import {waitForMdStreamToComplete} from '../../utils/wait';

describe('Code Block Markdowns Parser', () => {
    let streamRenderer: IObserver<string>;
    let rootElement: HTMLElement;

    beforeEach(() => {
        rootElement = document.createElement('div');
        streamRenderer = createMdStreamRenderer(rootElement, {skipAnimation: true});
    });

    it('should render a 1 line code block without trailing or leading new line', async () => {
        streamRenderer.next('```\nconst a = 1;\n```');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<pre>const a = 1;</pre>');
    });

    it('should render a 1 line code block without multiple leading new lines', async () => {
        streamRenderer.next('```\n\n\nconst a = 1;\n```');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<pre>const a = 1;</pre>');
    });

    it('should render a 1 line code block without multiple trailing new lines', async () => {
        streamRenderer.next('```\nconst a = 1;\n\n\n\n```');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<pre>const a = 1;</pre>');
    });

    it('should not render <br /> inside a code block', async () => {
        streamRenderer.next('```\nconst a = 1;  \nconst b = 2;\n```');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<pre>const a = 1;  \nconst b = 2;</pre>');
    });

    it('should not render heading inside a code block', async () => {
        streamRenderer.next('```\n# Heading\n```');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<pre># Heading</pre>');
    });

    it('should render code block wihtout language', async () => {
        streamRenderer.next('```js\nconst a = 1;\n```');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<pre>const a = 1;</pre>');
    });

    it('should render code block at root level', async () => {
        streamRenderer.next('Some code:```js\nconst a = 1;\n```');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p>Some code:</p><pre>const a = 1;</pre>');
    });

    it('should render code block that follows a heading', async () => {
        streamRenderer.next('# Heading\n```js\nconst a = 1;\n```');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<h1>Heading</h1><pre>const a = 1;</pre>');
    });

    it('should render code block even when empty', async () => {
        streamRenderer.next('```js```');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<pre></pre>');
    });

    it('should render code block even when empty with new line inside', async () => {
        streamRenderer.next('```js\n```');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<pre></pre>');
    });

    it('should render code block followed by a heading', async () => {
        streamRenderer.next('```js\nconst a = 1;\n```\n# Heading');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<pre>const a = 1;</pre><h1>Heading</h1>');
    });

    it('should render code block followed by a paragraph', async () => {
        streamRenderer.next('```js\nconst a = 1;\n```\nSome paragraph');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<pre>const a = 1;</pre><p>Some paragraph</p>');
    });
});
