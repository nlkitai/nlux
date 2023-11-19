import {createMdStreamRenderer, IObserver} from '@nlux/nlux';
import {waitForMdStreamToComplete} from '../../utils/wait';

describe('Underscore Italic Markdowns Parser', () => {
    let streamRenderer: IObserver<string>;
    let rootElement: HTMLElement;

    beforeEach(() => {
        rootElement = document.createElement('div');
        streamRenderer = createMdStreamRenderer(rootElement);
    });

    it('should render an italic in the middle of a paragraph', async () => {
        streamRenderer.next('Hello _World_ !');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p>Hello <em>World</em> !</p>');
    });

    it('should render an italic at the end of a paragraph', async () => {
        streamRenderer.next('Hello _World_');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p>Hello <em>World</em></p>');
    });

    it('should render an italic at the beginning of a paragraph', async () => {
        streamRenderer.next('_Hello_ World');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p><em>Hello</em> World</p>');
    });

    it('should wrap italic in a paragraph', async () => {
        streamRenderer.next('_Hello World_');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p><em>Hello World</em></p>');
    });

    it('should embed italic into a paragraph, and code into the italic', async () => {
        streamRenderer.next('_Hello `World`_');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p><em>Hello <code>World</code></em></p>');
    });

    it('should embed code into a paragraph, and italic into the code', async () => {
        streamRenderer.next('`Hello _World_`');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p><code>Hello <em>World</em></code></p>');
    });

    it('should embed italic at the beginning of inline code', async () => {
        streamRenderer.next('`_Hello_ World`');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p><code><em>Hello</em> World</code></p>');
    });

    it('should embed italic at the end of inline code', async () => {
        streamRenderer.next('`Hello _World_`');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p><code>Hello <em>World</em></code></p>');
    });
});
