import {createMdStreamRenderer, IObserver, StandardStreamParserOutput} from '@nlux/core';
import {waitForMdStreamToComplete} from '../../utils/wait';

describe('Embedded Bold Italic Markdowns Parser', () => {
    let streamRenderer: StandardStreamParserOutput;
    let rootElement: HTMLElement;

    beforeEach(() => {
        rootElement = document.createElement('div');
        streamRenderer = createMdStreamRenderer(rootElement, undefined, {skipAnimation: true});
    });

    it('should render an italic with asterisk immediately inside bold', async () => {
        streamRenderer.next('Hello ***World*** !');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p>Hello <strong><em>World</em></strong> !</p>');
    });

    it('should render italic with underscores immediately inside bold', async () => {
        streamRenderer.next('Hello ___World___ !');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p>Hello <strong><em>World</em></strong> !</p>');
    });

    it('should render bold with asterisks immediately inside italic with underscores', async () => {
        streamRenderer.next('Hello _**World**_ !');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p>Hello <em><strong>World</strong></em> !</p>');
    });

    it('should render bold with underscores immediately inside italic with asterisks', async () => {
        streamRenderer.next('Hello *__World__* !');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p>Hello <em><strong>World</strong></em> !</p>');
    });

    it('should render italic with asterisks immediately inside bold with underscores', async () => {
        streamRenderer.next('Hello __*World*__ !');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p>Hello <strong><em>World</em></strong> !</p>');
    });

    it('should render italic with underscores immediately inside bold with asterisks', async () => {
        streamRenderer.next('Hello **_World_** !');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p>Hello <strong><em>World</em></strong> !</p>');
    });

    it('should render bold with asterisks immediately inside italic with asterisks, followed by extra asterisk',
        async () => {
            streamRenderer.next('Hello ***World***** !');
            streamRenderer.complete();
            await waitForMdStreamToComplete();

            expect(rootElement.innerHTML).toBe('<p>Hello <strong><em>World</em></strong>** !</p>');
        });

    it('should render bold with underscores immediately inside italic with underscores, '
        + 'followed by extra underscore', async () => {
        streamRenderer.next('Hello ___World_____ !');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p>Hello <strong><em>World</em></strong>__ !</p>');
    });

    it('should render code inside bold inside code inside italic', async () => {
        streamRenderer.next('Hello _`**`World`**`_ !');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML).toBe('<p>Hello <em><code><strong><code>World</code></strong></code></em> !</p>');
    });
});
