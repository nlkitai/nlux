import {createMdStreamRenderer, IObserver} from '@nlux/nlux';

describe('MD Stream Parser Parsing Code', () => {
    let streamRenderer: IObserver<string>;
    let rootElement: HTMLElement;

    beforeEach(() => {
        rootElement = document.createElement('div');
        streamRenderer = createMdStreamRenderer(rootElement);
    });

    describe('Inline code blocks', () => {
        it('should render inline code blocks in a <code /> tag', () => {
            streamRenderer.next('`x();`');
            streamRenderer.complete();
            expect(rootElement.innerHTML).toBe('<code>x();</code>');
        });

        it('should render multiple consecutive inline code blocks <code /> tags', () => {
            streamRenderer.next('`x();`');
            streamRenderer.next('`y();`');
            streamRenderer.complete();
            expect(rootElement.innerHTML).toBe('<code>x();</code><code>y();</code>');
        });

        it('should render multiple consecutive inline code blocks separated by new line in <code /> tags', () => {
            streamRenderer.next('`x();`\n');
            streamRenderer.next('`y();`');
            streamRenderer.complete();
            expect(rootElement.innerHTML).toBe('<code>x();</code><code>y();</code>');
        });
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
            streamRenderer.next('Hello Code ();\n');
            streamRenderer.next('```');
            streamRenderer.complete();
            expect(rootElement.innerHTML).toBe('<pre data-language="ts">Hello Code ();</pre>');
        });

        it('should render code blocks in a <pre /> tag with language and title', () => {
            streamRenderer.next('```javascript Code Title\n');
            streamRenderer.next('Hello Code ();\n');
            streamRenderer.next('```');
            streamRenderer.complete();
            expect(rootElement.innerHTML)
                .toBe('<pre data-language="javascript" data-title="Code Title">Hello Code ();</pre>');
        });

        it('should not close a code block if the closing sequence is not on a new line', () => {
            streamRenderer.next('```\n');
            streamRenderer.next('Hello Code ();');
            streamRenderer.next('```');
            streamRenderer.next('\nOther Function();');
            streamRenderer.next('\n```');
            streamRenderer.complete();
            expect(rootElement.innerHTML)
                .toBe('<pre>Hello Code ();```\nOther Function();</pre>');
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
            const veryLongTitle = 'Code Title That Is Very Very Very Very Very Very Very Very Very Long Very Very Very Very Very Very Very Very Very Long';
            streamRenderer.next(`\`\`\`javascript ${veryLongTitle}\n`);
            streamRenderer.next('Hello Code ();');
            streamRenderer.next('\n```'); // It will start a new code block since the previous one was not opened.
            streamRenderer.next('\nText that is not code rendered in code block');
            streamRenderer.complete();
            expect(rootElement.innerHTML)
                .toBe(`<p>\`\`\`javascript ${veryLongTitle}<br>Hello Code ();</p><pre>Text that is not code rendered in code block</pre>`);
        });

        it('It should render code block followed by a paragraph when the title is not very long', () => {
            const normalTitle = 'Normal Title';
            streamRenderer.next(`\`\`\`javascript ${normalTitle}\n`);
            streamRenderer.next('Hello Code ();');
            streamRenderer.next('\n```'); // It will close the previous code block.
            streamRenderer.next('\nText that is not code');
            streamRenderer.complete();
            expect(rootElement.innerHTML)
                .toBe(`<pre data-language="javascript" data-title="Normal Title">Hello Code ();</pre><p>Text that is not code</p>`);
        });

        it('should not add empty lines at the beginning of a code block event without complete() call', () => {
            streamRenderer.next('```\n');
            streamRenderer.next('\n');
            streamRenderer.next('Hello Code ();\n');
            streamRenderer.next('\n');
            streamRenderer.next('```');
            expect(rootElement.innerHTML).toBe('<pre>Hello Code ();\n\n</pre>');
        });

        it('should trim empty lines at the beginning and end of code blocks when complete is called', () => {
            streamRenderer.next('```\n');
            streamRenderer.next('\n');
            streamRenderer.next('Hello Code ();\n');
            streamRenderer.next('\n');
            streamRenderer.next('```');
            streamRenderer.complete();
            expect(rootElement.innerHTML).toBe('<pre>Hello Code ();</pre>');
        });

        it('should trim white spaces at the beginning and end of code blocks when complete is called', () => {
            streamRenderer.next('```\n');
            streamRenderer.next('    Hello Code ();\n');
            streamRenderer.next('```');
            streamRenderer.complete();
            expect(rootElement.innerHTML).toBe('<pre>Hello Code ();</pre>');
        });
    });
});
