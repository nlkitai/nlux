import {AiChat, createAiChat} from '@nlux-dev/core/src';
import {highlighter} from '@nlux-dev/highlighter/src';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForMdStreamToComplete, waitForRenderCycle} from '../../../../utils/wait';

describe('createAiChat() + messageOptions + syntaxHighlighter', () => {
    let adapterController: AdapterController | undefined = undefined;
    let rootElement: HTMLElement;
    let aiChat: AiChat | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder()
            .withBatchText(true)
            .withStreamText(false)
            .create();

        rootElement = document.createElement('div');
        document.body.append(rootElement);
    });

    afterEach(() => {
        adapterController = undefined;
        aiChat?.unmount();
        rootElement?.remove();
        aiChat = undefined;
    });

    describe('When a syntax highlighter is used', () => {
        it('Code should be highlighted', async () => {
            // Arrange
            aiChat = createAiChat()
                .withAdapter(adapterController!.adapter)
                .withMessageOptions({
                    syntaxHighlighter: highlighter,
                    showCodeBlockCopyButton: false,
                    skipStreamingAnimation: true,
                    streamingAnimationSpeed: 0,
                });

            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;

            await userEvent.type(textArea, 'Write some JS code{enter}');
            await waitForRenderCycle();

            // Act
            adapterController!.resolve('```js\nvar someJsCode = true;\n\n```');
            await waitForMdStreamToComplete(100);

            // Assert
            const responseElement = rootElement.querySelector('.nlux-comp-chatItem--received .nlux-markdown-container');
            expect(responseElement!.innerHTML).toBe(
                '<div class="code-block"><pre data-language="js" class="highlighter-dark"><div><span class="hljs-keyword">var</span> someJsCode = <span class="hljs-literal">true</span>;\n</div></pre></div>',
            );
        });
    });

    describe('When no syntax highlighter is used', () => {
        it('Code should not be highlighted', {timeout: 50000}, async () => {
            // Arrange
            aiChat = createAiChat()
                .withAdapter(adapterController!.adapter)
                .withMessageOptions({
                    showCodeBlockCopyButton: false,
                    skipStreamingAnimation: true,
                    streamingAnimationSpeed: 0,
                });

            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;

            await userEvent.type(textArea, 'Write some JS code{enter}');
            await waitForRenderCycle();

            // Act
            adapterController!.resolve('```\nvar someJsCode = true;\n```');
            await waitForMdStreamToComplete(200);

            // Assert
            const responseElement = rootElement.querySelector('.nlux-comp-chatItem--received .nlux-markdown-container');
            expect(responseElement?.innerHTML).toBe(
                '<div class="code-block"><pre><div>var someJsCode = true;\n</div></pre></div>',
            );
        });
    });

    describe('When a syntax highlighter is removed after being set', () => {
        it('Code should not be highlighted', async () => {
            // Arrange
            aiChat = createAiChat()
                .withAdapter(adapterController!.adapter)
                .withMessageOptions({
                    syntaxHighlighter: highlighter,
                    showCodeBlockCopyButton: false,
                    skipStreamingAnimation: true,
                    streamingAnimationSpeed: 0,
                });

            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;

            // Act
            aiChat.updateProps({
                messageOptions: {syntaxHighlighter: undefined},
            });
            await waitForRenderCycle();

            await userEvent.type(textArea, 'Write some JS code{enter}');
            await waitForRenderCycle();

            adapterController!.resolve('```js\nvar someJsCode = true;\n```');
            await waitForMdStreamToComplete(200);

            // Assert
            const responseElement = rootElement.querySelector('.nlux-comp-chatItem--received .nlux-markdown-container');
            expect(responseElement?.innerHTML).toBe(
                '<div class="code-block"><pre data-language="js"><div>var someJsCode = true;\n</div></pre></div>',
            );
        });
    });
});
