import {createMdStreamRenderer, IObserver} from '@nlux/nlux';

describe('MD Stream Parser Parsing', () => {
    let streamRenderer: IObserver<string>;
    let rootElement: HTMLElement;

    beforeEach(() => {
        rootElement = document.createElement('div');
        streamRenderer = createMdStreamRenderer(rootElement);
    });

    describe('Default tag', () => {
        it('should ignore \n at the beginning of a paragraph', () => {
            streamRenderer.next('\nHello World');
            streamRenderer.complete();
            expect(rootElement.innerHTML).toBe('<p>Hello World</p>');
        });

        it('should render text in a <p /> tag', () => {
            streamRenderer.next('Hello World');
            streamRenderer.complete();
            expect(rootElement.innerHTML).toBe('<p>Hello World</p>');
        });

        it('should render text in a <p /> tag with new line', () => {
            streamRenderer.next('Hello World\n');
            streamRenderer.complete();
            expect(rootElement.innerHTML).toBe('<p>Hello World</p>');
        });

        it('should render new line with <br /> tag', () => {
            streamRenderer.next('Hello World\nHi World');
            streamRenderer.complete();
            expect(rootElement.innerHTML).toBe('<p>Hello World<br>Hi World</p>');
        });

        it('should start a new <p /> tag after 2 consecutive new lines', () => {
            streamRenderer.next('Hello World\n\nHi World');
            streamRenderer.complete();
            expect(rootElement.innerHTML).toBe('<p>Hello World</p><p>Hi World</p>');
        });
    });

    // Header tags
    ['h1', 'h2', 'h3'].forEach((headerTagName) => {
        const md = headerTagName === 'h3' ? '###' : (headerTagName === 'h2' ? '##' : '#');
        const tagNameReadable = headerTagName.toUpperCase();

        describe(headerTagName, () => {
            it(`should render ${headerTagName} in a <${headerTagName} /> tag with space between ${md} and letters'`,
                () => {
                    streamRenderer.next(`${md} Header ${tagNameReadable}`);
                    streamRenderer.complete();
                    expect(rootElement.innerHTML)
                        .toBe(`<${headerTagName}>Header ${tagNameReadable}</${headerTagName}>`);
                });

            it(`should render ${headerTagName}  in a <${headerTagName} /> tag without space between ${md} and letters`,
                () => {
                    streamRenderer.next(`${md}Header ${tagNameReadable}`);
                    streamRenderer.complete();
                    expect(rootElement.innerHTML)
                        .toBe(`<${headerTagName}>Header ${tagNameReadable}</${headerTagName}>`);
                });

            it(`should render an empty <${headerTagName} /> when ${md} is followed by new line`, () => {
                streamRenderer.next(`${md}`);
                streamRenderer.next('\n');
                streamRenderer.complete();
                expect(rootElement.innerHTML).toBe(`<${headerTagName}></${headerTagName}>`);
            });

            it(`should not render <${headerTagName} /> if ${md} is not at the beginning of a new line`, () => {
                streamRenderer.next(`Hello ${md} World`);
                streamRenderer.complete();
                expect(rootElement.innerHTML).toBe(`<p>Hello ${md} World</p>`);
            });

            it(`should close the previous tag and render <${headerTagName} /> if ${md} is in a new line after another tag`,
                () => {
                    streamRenderer.next('A\n');
                    streamRenderer.next(`${md} B`);
                    streamRenderer.complete();
                    expect(rootElement.innerHTML).toBe(`<p>A</p><${headerTagName}>B</${headerTagName}>`);
                });
        });
    });
});
