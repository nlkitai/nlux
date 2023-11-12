import {createMdStreamRenderer, IObserver} from '@nlux/nlux';

describe('MD Stream Parser Parsing Nested Tags', () => {
    let streamRenderer: IObserver<string>;
    let rootElement: HTMLElement;

    beforeEach(() => {
        rootElement = document.createElement('div');
        streamRenderer = createMdStreamRenderer(rootElement);
    });

    describe('Inline code block', () => {
        it('should render code block nested in a <p /> tag', () => {
            streamRenderer.next('Hello `World`');
            streamRenderer.complete();
            expect(rootElement.innerHTML).toBe('<p>Hello <code>World</code></p>');
        });

        it('should render nested strong', () => {
            streamRenderer.next('Say `Hello **World**` Now!');
            streamRenderer.complete();
            expect(rootElement.innerHTML).toBe('<p>Say <code>Hello <strong>World</strong></code> Now!</p>');
        });

        it('should render code block nested in a <h1 /> tag', () => {
            streamRenderer.next('# Hello `World`');
            streamRenderer.complete();
            expect(rootElement.innerHTML).toBe('<h1>Hello <code>World</code></h1>');
        });

        it('should render code block nested in a <h2 /> tag', () => {
            streamRenderer.next('## Hello `World`');
            streamRenderer.complete();
            expect(rootElement.innerHTML).toBe('<h2>Hello <code>World</code></h2>');
        });

        it('should render code block nested in a <h3 /> tag', () => {
            streamRenderer.next('### Hello `World`');
            streamRenderer.complete();
            expect(rootElement.innerHTML).toBe('<h3>Hello <code>World</code></h3>');
        });
    });

    describe('Strong', () => {
        it('should render strong nested in a <p /> tag', () => {
            streamRenderer.next('Hello **World**!');
            streamRenderer.complete();
            expect(rootElement.innerHTML).toBe('<p>Hello <strong>World</strong>!</p>');
        });

        it('should render strong nested in a <h1 /> tag', () => {
            streamRenderer.next('# Hello **World**');
            streamRenderer.complete();
            expect(rootElement.innerHTML).toBe('<h1>Hello <strong>World</strong></h1>');
        });

        it('should render strong nested in a <h2 /> tag', () => {
            streamRenderer.next('## Hello **World**');
            streamRenderer.complete();
            expect(rootElement.innerHTML).toBe('<h2>Hello <strong>World</strong></h2>');
        });

        it('should render strong nested in a <h3 /> tag', () => {
            streamRenderer.next('### Hello **World**');
            streamRenderer.complete();
            expect(rootElement.innerHTML).toBe('<h3>Hello <strong>World</strong></h3>');
        });
    });
});
