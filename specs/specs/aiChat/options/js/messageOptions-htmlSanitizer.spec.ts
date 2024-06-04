import {AiChat, createAiChat} from '@nlux-dev/core/src';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForMdStreamToComplete, waitForRenderCycle} from '../../../../utils/wait';

describe('createAiChat() + messageOptions + htmlSanitizer', () => {
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

    describe('When htmlSanitizer is not set', () => {
        it('Message content should render the message as is', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter);

            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;

            await userEvent.type(textArea, 'Give me a link please{enter}');
            await waitForRenderCycle();

            // Act
            adapterController!.resolve('Click [here](https://example.com)');
            await waitForMdStreamToComplete(100);

            // Assert
            const markdownContainer = rootElement.querySelector('.nlux-comp-chatItem--received .nlux-markdown-container');
            expect(markdownContainer).toBeInTheDocument();

            const link = markdownContainer!.querySelector('a');
            expect(link).toBeInTheDocument();
            expect(link!.getAttribute('target')).toBe('_blank');
        });
    });

    describe('When htmlSanitizer is set to a custom function', () => {
        it('Renderer user prompt content should be sanitized using the custom function', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter).withMessageOptions({
                // A dummy sanitizer that replaces all 'x' with '.'
                htmlSanitizer: (html: string) => html.toLowerCase().replaceAll('h', 'x'),
            });

            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;

            await userEvent.type(textArea, 'Hi! Henry The Assistant. Help! Give me a hyperlink!{enter}');
            await waitForRenderCycle();

            // Act
            adapterController!.resolve('Hi! [here](https://haha.hawai) I hand over a link! Haha :) !');
            await waitForMdStreamToComplete(60);

            // Assert
            const userMessageContainer = rootElement.querySelector('.nlux-comp-chatItem--sent .nlux-markdown-container') as HTMLElement | null;
            expect(userMessageContainer!.innerHTML).toBe('<p>xi! xenry txe assistant. xelp! give me a xyperlink!</p>\n');
        });

        it('Renderer ai message content should be sanitized using the custom function', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter).withMessageOptions({
                // A dummy sanitizer that replaces all 'x' with '.'
                htmlSanitizer: (html: string) => html
                    .toLowerCase()
                    .replaceAll('h', 'x')
                    .replaceAll('<p>', '<div>')
                    .replaceAll('</p>', '</div>'),
            });

            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;

            await userEvent.type(textArea, 'Hi! Henry The Assistant. Help! Give me a hyperlink!{enter}');
            await waitForRenderCycle();

            // Act
            adapterController!.resolve('Hi! [here](https://haha.hawai) I hand over a link! Haha :) !');
            await waitForMdStreamToComplete(200);

            // Assert
            const markdownContainer = rootElement.querySelector('.nlux-comp-chatItem--received .nlux-markdown-container') as HTMLElement | null;
            expect(markdownContainer).toBeInTheDocument();
            expect(markdownContainer!.innerHTML).toBe('<div>xi! <a xref="xttps://xaxa.xawai" target="_blank">xere</a> i xand over a link! xaxa :) !</div>\n');
        });
    });
});
