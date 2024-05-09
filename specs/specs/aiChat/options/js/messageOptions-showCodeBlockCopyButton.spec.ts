import {AiChat, createAiChat} from '@nlux-dev/core/src';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForMdStreamToComplete, waitForRenderCycle} from '../../../../utils/wait';

describe('createAiChat() + messageOptions + showCodeBlockCopyButton', () => {
    let adapterController: AdapterController | undefined = undefined;
    let rootElement: HTMLElement;
    let aiChat: AiChat | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder()
            .withFetchText(true)
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

    describe('When showCodeBlockCopyButton is not set', () => {
        it('Markdown code blocks should have a copy button', async () => {
            // Arrange
            aiChat = createAiChat()
                .withMessageOptions({showCodeBlockCopyButton: true})
                .withAdapter(adapterController!.adapter);

            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;

            await userEvent.type(textArea, 'Give me a link please{enter}');
            await waitForRenderCycle();

            // Act
            adapterController!.resolve('This is code block\n```js\nconsole.log("Hello, World!");\n```\n');
            await waitForMdStreamToComplete(100);

            // Assert
            const markdownContainer = rootElement.querySelector('.nlux_cht_itm_in .nlux-md-cntr');
            expect(markdownContainer).toBeInTheDocument();

            const button = markdownContainer!.querySelector('.nlux-cpy-btn');
            expect(button).toBeInTheDocument();
        });
    });

    describe('When showCodeBlockCopyButton is set to false', () => {
        it('Markdown code blocks should not have a copy button', async () => {
            // Arrange
            aiChat = createAiChat()
                .withMessageOptions({showCodeBlockCopyButton: false})
                .withAdapter(adapterController!.adapter);

            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;

            await userEvent.type(textArea, 'Give me a link please{enter}');
            await waitForRenderCycle();

            // Act
            adapterController!.resolve('This is code block\n```js\nconsole.log("Hello, World!");\n```\n');
            await waitForMdStreamToComplete(100);

            // Assert
            const markdownContainer = rootElement.querySelector('.nlux_cht_itm_in .nlux-md-cntr');
            expect(markdownContainer).toBeInTheDocument();

            const button = markdownContainer!.querySelector('.nlux-cpy-btn');
            expect(button).not.toBeInTheDocument();
        });
    });

    describe('When showCodeBlockCopyButton is set to true', () => {
        it('Markdown code blocks should have a copy button', async () => {
            // Arrange
            aiChat = createAiChat()
                .withMessageOptions({showCodeBlockCopyButton: true})
                .withAdapter(adapterController!.adapter);

            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;

            await userEvent.type(textArea, 'Give me a link please{enter}');
            await waitForRenderCycle();

            // Act
            adapterController!.resolve('This is code block\n```js\nconsole.log("Hello, World!");\n```\n');
            await waitForMdStreamToComplete(100);

            // Assert
            const markdownContainer = rootElement.querySelector('.nlux_cht_itm_in .nlux-md-cntr');
            expect(markdownContainer).toBeInTheDocument();

            const button = markdownContainer!.querySelector('.nlux-cpy-btn');
            expect(button).toBeInTheDocument();
        });
    });
});
