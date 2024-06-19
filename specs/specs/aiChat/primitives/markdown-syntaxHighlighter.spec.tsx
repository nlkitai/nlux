import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {AdapterController} from '../../../utils/adapters';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AiChat, Markdown, ResponseRenderer} from '@nlux-dev/react/src';
import {highlighter} from '@nlux-dev/highlighter/src';
import {memo} from 'react';
import {render} from '@testing-library/react';
import {waitForReactRenderCycle} from '../../../utils/wait';
import userEvent from '@testing-library/user-event';

describe('<AiChat /> + <Markdown /> + syntax highlighter', () => {
    let adapterController: AdapterController | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder()
            .withBatchText(true)
            .withStreamText(false)
            .create();
    });

    afterEach(() => {
        adapterController = undefined;
    });

    it('should parse and render the markdown content', async () => {
        // Arrange
        const responseRenderer: ResponseRenderer<string> = memo((props) => {
            const {dataTransferMode, content} = props;
            return (
                <div>
                    <h1>Response Renderer</h1>
                    <Markdown>{content}</Markdown>
                </div>
            );
        });

        const {container} = render(
            <AiChat
                adapter={adapterController!.adapter}
                messageOptions={{
                    responseRenderer,
                    showCodeBlockCopyButton: false,
                    syntaxHighlighter: highlighter,
                }}
            />,
        );
        const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;
        await waitForReactRenderCycle();

        // Act
        await userEvent.type(textArea, 'Hello{enter}');
        await waitForReactRenderCycle();

        adapterController!.resolve('```js\nvar someJsCode = true;\n\n```');
        await waitForReactRenderCycle();

        // Assert
        const responseElement = container.querySelector('.nlux-comp-chatItem--received .nlux-markdown-container');
        expect(responseElement!.innerHTML).toBe(
            '<div class="code-block"><pre data-language="js" class="highlighter-dark"><div><span class="hljs-keyword">var</span> someJsCode = <span class="hljs-literal">true</span>;\n</div></pre></div>\n',
        );
    });
});
