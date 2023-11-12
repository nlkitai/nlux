import {createMdStreamRenderer, IObserver} from '@nlux/nlux';

describe('MD Stream Parser Parsing Bold And Italic Tags', () => {
    let streamRenderer: IObserver<string>;
    let rootElement: HTMLElement;

    beforeEach(() => {
        rootElement = document.createElement('div');
        streamRenderer = createMdStreamRenderer(rootElement);
    });

    describe('Bold text', () => {
        it('should render bold text using asterisks', () => {
            streamRenderer.next('**Hello World**');
            streamRenderer.complete();
            expect(rootElement.innerHTML).toBe('<strong>Hello World</strong>');
        });

        it('should render bold text using underscores', () => {
            streamRenderer.next('__Hello World__');
            streamRenderer.complete();
            expect(rootElement.innerHTML).toBe('<strong>Hello World</strong>');
        });

        it('should render bold text nested in a <p /> tag using asterisks', () => {
            streamRenderer.next('Hello **World**');
            streamRenderer.complete();
            expect(rootElement.innerHTML).toBe('<p>Hello <strong>World</strong></p>');
        });

        it('should render bold text nested in a <p /> tag using underscores', () => {
            streamRenderer.next('Hello __World__');
            streamRenderer.complete();
            expect(rootElement.innerHTML).toBe('<p>Hello <strong>World</strong></p>');
        });

        // TODO
        it.skip('should render strong text at the beginning of a paragraph', () => {
            streamRenderer.next('**Hello World** Yo!');
            streamRenderer.complete();
            expect(rootElement.innerHTML).toBe('<p><strong>Hello World</strong> Yo!</p>');
        });
    });

    describe('Italic text', () => {
        it('should render italic text using asterisks', () => {
            streamRenderer.next('*Hello World*');
            streamRenderer.complete();
            expect(rootElement.innerHTML).toBe('<em>Hello World</em>');
        });

        it('should render italic text using underscores', () => {
            streamRenderer.next('_Hello World_');
            streamRenderer.complete();
            expect(rootElement.innerHTML).toBe('<em>Hello World</em>');
        });

        // TODO
        it.skip('should render italic text at the beginning of a paragraph', () => {
            streamRenderer.next('*Hello World* Yo!');
            streamRenderer.complete();
            expect(rootElement.innerHTML).toBe('<p><em>Hello World</em> Yo!</p>');
        });

        it('should render italic text nested in a <p /> tag using asterisks', () => {
            streamRenderer.next('Hello *World*');
            streamRenderer.complete();
            expect(rootElement.innerHTML).toBe('<p>Hello <em>World</em></p>');
        });

        it('should render italic text nested in a <p /> tag using underscores', () => {
            streamRenderer.next('Hello _World_');
            streamRenderer.complete();
            expect(rootElement.innerHTML).toBe('<p>Hello <em>World</em></p>');
        });
    });

    describe('Bold/italic embedded', () => {
        it('should render italic text embedded in bold text using asterisks', () => {
            streamRenderer.next('***H***');
            streamRenderer.complete();
            expect(rootElement.innerHTML).toBe('<strong><em>H</em></strong>');
        });

        it('should render italic text embedded in bold text using underscores', () => {
            streamRenderer.next('___H___');
            streamRenderer.complete();
            expect(rootElement.innerHTML).toBe('<strong><em>H</em></strong>');
        });

        it('should render bold text embedded in italic text using asterisks and underscores', () => {
            streamRenderer.next('*__H__*');
            streamRenderer.complete();
            expect(rootElement.innerHTML).toBe('<em><strong>H</strong></em>');
        });

        it('should render bold text embedded in italic text using underscores and asterisks', () => {
            streamRenderer.next('_**H**_');
            streamRenderer.complete();
            expect(rootElement.innerHTML).toBe('<em><strong>H</strong></em>');
        });
    });
});
