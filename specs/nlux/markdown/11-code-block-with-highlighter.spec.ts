import {highlighter} from '@nlux/highlighter';
import {createMdStreamRenderer, IObserver} from '@nlux/nlux';
import {waitForMdStreamToComplete} from '../../utils/wait';

describe('Code Block Markdown Parser With Syntax Highlighter', () => {
    let streamRenderer: IObserver<string>;
    let rootElement: HTMLElement;

    beforeEach(() => {
        rootElement = document.createElement('div');
        streamRenderer = createMdStreamRenderer(rootElement, highlighter, {skipAnimation: true});
    });

    it('should highlight code block with language', async () => {
        streamRenderer.next('```js\nconst a = 1;\n```');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML)
            .toBe(
                '<pre data-language="js" class="highlighter-dark"><span class="hljs-keyword">const</span> a = <span class="hljs-number">1</span>;</pre>',
            );
    });

    it('should extract language from code block and add to data attribute', async () => {
        streamRenderer.next('```js\nconst a = 1;\n```');
        streamRenderer.complete();
        await waitForMdStreamToComplete();

        expect(rootElement.innerHTML)
            .toBe(
                '<pre data-language="js" class="highlighter-dark"><span class="hljs-keyword">const</span> a = <span class="hljs-number">1</span>;</pre>',
            );
    });
});
