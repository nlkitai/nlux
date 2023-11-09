import {createMdStreamRenderer, IObserver} from '@nlux/nlux';

describe('MD Stream Parser Parsing Code', () => {
    let streamRenderer: IObserver<string>;
    let rootElement: HTMLElement;

    beforeEach(() => {
        rootElement = document.createElement('div');
        streamRenderer = createMdStreamRenderer(rootElement);
    });

    describe('Code Blocks', () => {
        it('should render code blocks in a <pre /> tag', () => {
            streamRenderer.next('```\n');
            streamRenderer.next('Hello Code ();\n');
            streamRenderer.next('```');
            streamRenderer.complete();
            expect(rootElement.innerHTML).toBe('<pre>Hello Code ();</pre>');
        });

        it('should render code blocks in a <pre /> tag with language', () => {
            streamRenderer.next('```ts\n');
            streamRenderer.next('Hello Code ();');
            streamRenderer.next('```');
            streamRenderer.complete();
            expect(rootElement.innerHTML).toBe('<pre data-language="ts">Hello Code ();</pre>');
        });

        it('should render code blocks in a <pre /> tag with language and title', () => {
            streamRenderer.next('```javascript Code Title\n');
            streamRenderer.next('Hello Code ();');
            streamRenderer.next('```');
            streamRenderer.complete();
            expect(rootElement.innerHTML)
                .toBe('<pre data-language="javascript" data-title="Code Title">Hello Code ();</pre>');
        });

        it('should renderer new lines inside code block', () => {
            streamRenderer.next('```javascript Code Title\n');
            streamRenderer.next('Hello Code ();\n');
            streamRenderer.next('Hello Code ();\n');
            streamRenderer.next('```');
            streamRenderer.complete();
            expect(rootElement.innerHTML)
                .toBe('<pre data-language="javascript" data-title="Code Title">Hello Code ();\nHello Code ();</pre>');
        });

        it('It should not render code block if no new line after ```', () => {
            streamRenderer.next('```javascript Code Title');
            streamRenderer.next('Hello Code ();');
            streamRenderer.next('```');
            streamRenderer.complete();
            expect(rootElement.innerHTML).toBe('<p>```javascript Code TitleHello Code ();```</p>');
        });

        it('It should not render code block if the first line is over 100 characters ```', () => {
            streamRenderer.next(
                '```javascript Code Title That Is Very Very Very Very Very Very Very Very Very Long Very Very Very Very Very Very Very Very Very Long\n');
            streamRenderer.next('Hello Code ();');
            streamRenderer.next('```');
            streamRenderer.complete();
            expect(rootElement.innerHTML)
                .toBe(
                    '<p>```javascript Code Title That Is Very Very Very Very Very Very Very Very Very Long Very Very Very Very Very Very Very Very Very Long<br>Hello Code ();```</p>');
        });

        it('should trimp empty lines at the beginning and end of code blocks', () => {
            streamRenderer.next('```\n');
            streamRenderer.next('\n');
            streamRenderer.next('Hello Code ();\n');
            streamRenderer.next('\n');
            streamRenderer.next('```');
            streamRenderer.complete();
            expect(rootElement.innerHTML).toBe('<pre>Hello Code ();</pre>');
        });

        it('should trimp white spaces at the beginning and end of code blocks', () => {
            streamRenderer.next('```\n');
            streamRenderer.next('    Hello Code ();\n');
            streamRenderer.next('```');
            streamRenderer.complete();
            expect(rootElement.innerHTML).toBe('<pre>Hello Code ();</pre>');
        });
    });
});
