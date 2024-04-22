import {beforeEach, describe, expect, it} from 'vitest';
import {createMdStreamRenderer} from '../../../packages/shared/src/markdown/streamParser';
import {StandardStreamParserOutput} from '../../../packages/shared/src/types/markdown/streamParser';
import {waitForMdStreamToComplete} from '../../utils/wait';

describe('Basic Embedded Markdowns Parser', () => {
    let streamRenderer: StandardStreamParserOutput;
    let rootElement: HTMLElement;

    beforeEach(() => {
        rootElement = document.createElement('div');
        streamRenderer = createMdStreamRenderer(rootElement, undefined, {skipAnimation: true});
    });

    it('should render a code in the middle of a paragraph', async () => {
        streamRenderer.next('Hello `World` !');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p>Hello <code>World</code> !</p>');
    });

    it('should render a code at the end of a paragraph', async () => {
        streamRenderer.next('Hello `World`');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p>Hello <code>World</code></p>');
    });

    it('should render a code at the beginning of a paragraph', async () => {
        streamRenderer.next('`Hello` World');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p><code>Hello</code> World</p>');
    });

    it('should wrap inline code in a paragraph', async () => {
        streamRenderer.next('`Hello World`');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p><code>Hello World</code></p>');
    });

    it('Should embed code into a paragraph, and bold into the code', async () => {
        streamRenderer.next('`Hello **World**`');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p><code>Hello <strong>World</strong></code></p>');
    });
});
