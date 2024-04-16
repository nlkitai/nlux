import {AiChat, createAiChat} from '@nlux/core';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {waitForRenderCycle} from '../../../utils/wait';

describe('createAiChat() + initial load', () => {
    let adapterController: AdapterController | undefined = undefined;

    let rootElement: HTMLElement;
    let aiChat: AiChat | undefined;

    beforeEach(() => {
        rootElement = document.createElement('div');
        document.body.append(rootElement);
    });

    afterEach(() => {
        adapterController = undefined;
        aiChat?.unmount();
        rootElement?.remove();
        aiChat = undefined;
    });

    it('Should not initially render anything is DOM', async () => {
        // Given
        adapterController = adapterBuilder().withFetchText().create();
        aiChat = createAiChat().withAdapter(adapterController.adapter);

        // When
        await waitForRenderCycle();

        // Then
        expect(rootElement?.innerHTML).toBe('');
    });

    describe('When mount() is called', () => {
        it('Chat component should render', async () => {
            // Given
            adapterController = adapterBuilder().withFetchText().create();
            aiChat = createAiChat().withAdapter(adapterController.adapter);

            // When
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            // Then
            const aiChatElement = rootElement.querySelector('.nlux-AiChat-root');
            expect(aiChatElement).toBeInTheDocument();
        });

        it('Exceptions box container should render', async () => {
            // Given
            adapterController = adapterBuilder().withFetchText().create();
            aiChat = createAiChat().withAdapter(adapterController.adapter);

            // When
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            // Then
            const exceptionsBoxContainer = rootElement.querySelector('.nlux-comp-exp_box');
            expect(exceptionsBoxContainer).toBeInTheDocument();
        });

        it('Prompt-box container should render', async () => {
            // Given
            adapterController = adapterBuilder().withFetchText().create();
            aiChat = createAiChat().withAdapter(adapterController.adapter);

            // When
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            // Then
            const promptBoxContainer = rootElement.querySelector('.nlux-comp-prmptBox');
            expect(promptBoxContainer).toBeInTheDocument();
        });

        it('Conversation container should render', async () => {
            // Given
            adapterController = adapterBuilder().withFetchText().create();
            aiChat = createAiChat().withAdapter(adapterController.adapter);

            // When
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            // Then
            const conversationContainer = rootElement.querySelector('.nlux-chtRm-cnv-cntr');
            expect(conversationContainer).toBeInTheDocument();
        });
    });

    describe('When mount() is called twice', () => {
        it('It should throw an error', async () => {
            // Given
            adapterController = adapterBuilder().withFetchText().create();
            aiChat = createAiChat().withAdapter(adapterController.adapter);

            // When
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            // Then
            expect(() => aiChat?.mount(rootElement)).toThrowError();
        });

        it('It should not render anything new in DOM', async () => {
            // Given
            adapterController = adapterBuilder().withFetchText().create();
            aiChat = createAiChat().withAdapter(adapterController.adapter);

            // When
            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const initialHtmlRendered = rootElement?.innerHTML;
            try {
                aiChat.mount(rootElement);
                await waitForRenderCycle();
            } catch (e) {
                // ignore
            }

            // Then
            expect(rootElement?.innerHTML).toBe(initialHtmlRendered);
        });
    });
});

