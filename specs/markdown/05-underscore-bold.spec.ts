import {createMdStreamRenderer, StandardStreamParserOutput} from '@nlux/core';
import {waitForMdStreamToComplete} from '../utils/wait';

describe('Underscore Bold Markdowns Parser', () => {
    let streamRenderer: StandardStreamParserOutput;
    let rootElement: HTMLElement;

    beforeEach(() => {
        rootElement = document.createElement('div');
        streamRenderer = createMdStreamRenderer(rootElement, undefined, {skipAnimation: true});
    });

    it('should render a bold in the middle of a paragraph', async () => {
        streamRenderer.next('Hello __World__ !');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p>Hello <strong>World</strong> !</p>');
    });

    it('should render a bold at the end of a paragraph', async () => {
        streamRenderer.next('Hello __World__');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p>Hello <strong>World</strong></p>');
    });

    it('should render a bold at the beginning of a paragraph', async () => {
        streamRenderer.next('__Hello__ World');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p><strong>Hello</strong> World</p>');
    });

    it('should wrap bold in a paragraph', async () => {
        streamRenderer.next('__Hello World__');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p><strong>Hello World</strong></p>');
    });

    it('should embed bold into a paragraph, and code into the bold', async () => {
        streamRenderer.next('__Hello `World`__');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p><strong>Hello <code>World</code></strong></p>');
    });

    it('should embed code into a paragraph, and bold into the code', async () => {
        streamRenderer.next('`Hello __World__`');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p><code>Hello <strong>World</strong></code></p>');
    });

    it('should embed bold at the beginning of inline code', async () => {
        streamRenderer.next('`__Hello__ World`');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p><code><strong>Hello</strong> World</code></p>');
    });

    it('should embed bold at the end of inline code', async () => {
        streamRenderer.next('`Hello __World__`');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p><code>Hello <strong>World</strong></code></p>');
    });
});
