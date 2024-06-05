import {beforeEach, describe, expect, it} from 'vitest';
import {createMdStreamRenderer} from '@shared/markdown/stream/streamParser';
import {StandardStreamParserOutput} from '@shared/types/markdown/streamParser';
import {waitForMdStreamToComplete} from '../../utils/wait';

describe('Line Breaks Markdowns Parser', () => {
    let streamRenderer: StandardStreamParserOutput;
    let rootElement: HTMLElement;

    beforeEach(() => {
        rootElement = document.createElement('div');
        streamRenderer = createMdStreamRenderer(rootElement, {
            skipStreamingAnimation: true,
            streamingAnimationSpeed: 0,
        });
    });

    it('should render a line break with two spaces and a new line', async () => {
        streamRenderer.next('Hi  \nWorld !');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p>Hi<br>World !</p>');
    });

    it('should not render an empty paragraph with spaces and a new line', async () => {
        streamRenderer.next('      ');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('');
    });

    it('should not render render new line at start when paragraph is empty', async () => {
        streamRenderer.next('      \nHi!');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p>Hi!</p>');
    });

    it('should render a new paragraph instead of a line break with two new lines', async () => {
        streamRenderer.next('Hi  \n\nWorld !');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p>Hi  </p><p>World !</p>');
    });

    it('should not render a line break inside an inline code markdown', async () => {
        streamRenderer.next('Hi `Mr  \n`World !');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p>Hi <code>Mr   </code>World !</p>');
    });

    it('should not render line break at the end of a paragraph', async () => {
        streamRenderer.next('Hi  ');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p>Hi  </p>');
    });

    it('should not render a line break inside a bold markdown', async () => {
        streamRenderer.next('Hi **Mr  \n**World !');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p>Hi **Mr<br>**World !</p>');
    });

    it('should render a line break inside a bold markdown followed by a white space', async () => {
        streamRenderer.next('A**B  \n  C**World !');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p>A<strong>B<br>  C</strong>World !</p>');
    });

    it('should not render a line break inside a bold markdown followed by another new line', async () => {
        streamRenderer.next('A**B  \nC**World !');
        streamRenderer.complete!();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p>A<strong>B<br>C</strong>World !</p>');
    });
});
