import {createMdStreamRenderer, StandardStreamParserOutput} from '@nlux/core';
import {waitForMdStreamToComplete} from '../../utils/wait';

describe('Line Breaks Markdowns Parser', () => {
    let streamRenderer: StandardStreamParserOutput;
    let rootElement: HTMLElement;

    beforeEach(() => {
        rootElement = document.createElement('div');
        streamRenderer = createMdStreamRenderer(rootElement, undefined, {skipAnimation: true});
    });

    it('should render a line break with two spaces and a new line', async () => {
        streamRenderer.next('Hi  \nWorld !');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p>Hi<br>World !</p>');
    });

    it('should not render an empty paragraph with spaces and a new line', async () => {
        streamRenderer.next('      \n');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('');
    });

    it('should not render render new line at start when paragraph is not empty', async () => {
        streamRenderer.next('      \nHi!');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<br><p>Hi!</p>');
    });

    it('should render a line break with two spaces and 2 new lines', async () => {
        streamRenderer.next('Hi  \n\nWorld !');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p>Hi<br>\nWorld !</p>');
    });

    it('should not render a line break with only 2 spaces and a new line', async () => {
        streamRenderer.next('Hi \nWorld !');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p>Hi \nWorld !</p>');
    });

    it('should render a line break with multiple spaces and a new line', async () => {
        streamRenderer.next('Hi    \nWorld !');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p>Hi<br>World !</p>');
    });

    it('should not render a line break inside an inline code markdown', async () => {
        streamRenderer.next('Hi `Mr  \n`World !');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p>Hi <code>Mr</code>World !</p>');
    });

    it('should render line break at the end of a paragraph', async () => {
        streamRenderer.next('Hi  \n');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p>Hi<br></p>');
    });

    it('should render a line break inside a bold markdown', async () => {
        streamRenderer.next('Hi **Mr  \n**World !');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p>Hi <strong>Mr<br></strong>World !</p>');
    });

    it('should render a line break inside a bold markdown followed by a white space', async () => {
        streamRenderer.next('A**B  \n  C**World !');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p>A<strong>B<br>  C</strong>World !</p>');
    });

    it('should render a line break inside a bold markdown followed by another new line', async () => {
        streamRenderer.next('A**B  \n\nC**World !');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p>A<strong>B<br>\nC</strong>World !</p>');
    });
});
