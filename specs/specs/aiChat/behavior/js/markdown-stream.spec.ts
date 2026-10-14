import {AiChat, createAiChat} from '@nlux-dev/core/src';
import {waitFor} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForRenderCycle} from '../../../../utils/wait';

describe('createAiChat() + stream adapter + markdown', () => {
    let adapterController: AdapterController | undefined = undefined;
    let rootElement: HTMLElement;
    let aiChat: AiChat | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder()
            .withBatchText(false)
            .withStreamText(true)
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

    describe('When markdown is being streamed', () => {
        it('Should be rendered correctly', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();

            // Act
            adapterController!.next('**Hello');
            adapterController!.next(' Human!**');

            // Assert
            await waitFor(() => {
                const markdownContainer = rootElement.querySelector('.nlux-comp-chatItem--received .nlux-markdown-container');
                expect(markdownContainer).toBeInTheDocument();
                expect(markdownContainer!.innerHTML).toContain('<strong>Hello Human!</strong>');
            });
        });
    });
});
