import {createMdStreamRenderer, IObserver} from '@nlux/nlux';
import {waitForMilliseconds} from '../../utils/wait';

describe('MD Stream Parser Streaming', () => {
    let streamRenderer: IObserver<string>;
    let rootElement: HTMLElement;

    beforeEach(() => {
        rootElement = document.createElement('div');
        streamRenderer = createMdStreamRenderer(rootElement, {skipAnimation: true});
    });

    it('should render text in a single paragraph', async () => {
        streamRenderer.next('Hello World');
        streamRenderer.complete();
        await waitForMilliseconds(200);

        expect(rootElement.innerHTML).toBe('<p>Hello World</p>');
    });

    it('should not render text in a single paragraph when all it containers is spaces', async () => {
        streamRenderer.next('    ');
        streamRenderer.complete();
        await waitForMilliseconds(200);

        expect(rootElement.innerHTML).toBe('');
    });

    it('should render text in a p even when it ends with pending sequence', async () => {
        streamRenderer.next('Hello World ##');
        streamRenderer.complete();
        await waitForMilliseconds(200);

        expect(rootElement.innerHTML).toBe('<p>Hello World ##</p>');
    });

    it('should render text in a p even when it ends with uncompleted sequence followed by # markdown', async () => {
        streamRenderer.next('A##\n# B');
        streamRenderer.complete();
        await waitForMilliseconds(200);

        expect(rootElement.innerHTML).toBe('<p>A##</p><h1>B</h1>');
    });

    it('should render text in a p even when it ends with uncompleted sequence followed by other markdown', async () => {
        streamRenderer.next('Hello World ##\n# Header');
        streamRenderer.complete();
        await waitForMilliseconds(200);

        expect(rootElement.innerHTML).toBe('<p>Hello World ##</p><h1>Header</h1>');
    });

    it('should render short text in a p even when it ends with uncompleted sequence followed by other markdown',
        async () => {
            streamRenderer.next('A#\n# H');
            streamRenderer.complete();
            await waitForMilliseconds(200);

            expect(rootElement.innerHTML).toBe('<p>A#</p><h1>H</h1>');
        });

    it('should render a single paragraph with a line break', async () => {
        streamRenderer.next('Hello World\n');
        streamRenderer.complete();
        await waitForMilliseconds(200);

        expect(rootElement.innerHTML).toBe('<p>Hello World</p>');
    });

    it('should close a paragraph and start new one after 2 empty lines', async () => {
        streamRenderer.next('Paragraph 1\n\nParagraph 2');
        streamRenderer.complete();
        await waitForMilliseconds(200);

        expect(rootElement.innerHTML).toBe('<p>Paragraph 1</p><p>Paragraph 2</p>');
    });

    it('should render paragraph followed by heading when separated by 1 line break', async () => {
        streamRenderer.next('Paragraph\n# Header');
        streamRenderer.complete();
        await waitForMilliseconds(200);

        expect(rootElement.innerHTML).toBe('<p>Paragraph</p><h1>Header</h1>');
    });
});
