import {createMdStreamRenderer, IObserver} from '@nlux/nlux';

describe('MD Stream Parser Streaming', () => {
    let streamRenderer: IObserver<string>;
    let rootElement: HTMLElement;

    beforeEach(() => {
        rootElement = document.createElement('div');
        streamRenderer = createMdStreamRenderer(rootElement);
    });

    describe('Default tag', () => {
        it('should render text in a <p /> tag as it\'s being streamed', () => {
            streamRenderer.next('H');
            expect(rootElement.innerHTML).toBe('<p>H</p>');

            streamRenderer.next('e');
            expect(rootElement.innerHTML).toBe('<p>He</p>');

            streamRenderer.next('l');
            expect(rootElement.innerHTML).toBe('<p>Hel</p>');

            streamRenderer.next('l');
            expect(rootElement.innerHTML).toBe('<p>Hell</p>');

            streamRenderer.next('o');
            expect(rootElement.innerHTML).toBe('<p>Hello</p>');

            streamRenderer.complete();
        });
    });

    describe('H1', () => {
        it('should render text in a <h1 /> tag as it\'s being streamed', () => {
            streamRenderer.next('#');
            expect(rootElement.innerHTML).toBe('');

            streamRenderer.next(' ');
            expect(rootElement.innerHTML).toBe('<h1></h1>');

            streamRenderer.next('H');
            expect(rootElement.innerHTML).toBe('<h1>H</h1>');

            streamRenderer.next('e');
            expect(rootElement.innerHTML).toBe('<h1>He</h1>');

            streamRenderer.next('l');
            expect(rootElement.innerHTML).toBe('<h1>Hel</h1>');

            streamRenderer.next('l');
            expect(rootElement.innerHTML).toBe('<h1>Hell</h1>');

            streamRenderer.next('o');
            expect(rootElement.innerHTML).toBe('<h1>Hello</h1>');

            streamRenderer.complete();
        });
    });

    describe('H2', () => {
        it('should render text in a <h2 /> tag as it\'s being streamed', () => {
            streamRenderer.next('#');
            expect(rootElement.innerHTML).toBe('');

            streamRenderer.next('#');
            expect(rootElement.innerHTML).toBe('');

            streamRenderer.next(' ');
            expect(rootElement.innerHTML).toBe('<h2></h2>');

            streamRenderer.next('H');
            expect(rootElement.innerHTML).toBe('<h2>H</h2>');

            streamRenderer.next('e');
            expect(rootElement.innerHTML).toBe('<h2>He</h2>');

            streamRenderer.next('l');
            expect(rootElement.innerHTML).toBe('<h2>Hel</h2>');

            streamRenderer.next('l');
            expect(rootElement.innerHTML).toBe('<h2>Hell</h2>');

            streamRenderer.next('o');
            expect(rootElement.innerHTML).toBe('<h2>Hello</h2>');

            streamRenderer.complete();
        });
    });
});
