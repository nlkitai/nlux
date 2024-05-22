import {AiChat, createAiChat} from '@nlux-dev/core/src';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import '@testing-library/jest-dom';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForRenderCycle} from '../../../../utils/wait';

describe('createAiChat() + mount', () => {
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
        // Arrange
        adapterController = adapterBuilder().withFetchText().create();
        aiChat = createAiChat().withAdapter(adapterController.adapter);

        // Act
        await waitForRenderCycle();

        // Assert
        expect(rootElement?.innerHTML).toBe('');
    });

    it('Initial status should be "idle"', async () => {
        // Arrange
        adapterController = adapterBuilder().withFetchText().create();
        aiChat = createAiChat().withAdapter(adapterController.adapter);

        // Act
        await waitForRenderCycle();

        // Assert
        expect(aiChat.status).toBe('idle');
    });

    describe('When mount() is called', () => {
        it('Chat component should render', async () => {
            // Arrange
            adapterController = adapterBuilder().withFetchText().create();
            aiChat = createAiChat().withAdapter(adapterController.adapter);

            // Act
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            // Assert
            const aiChatElement = rootElement.querySelector('.nlux-AiChat-root');
            expect(aiChatElement).toBeInTheDocument();
        });

        it('Exceptions box container should render', async () => {
            // Arrange
            adapterController = adapterBuilder().withFetchText().create();
            aiChat = createAiChat().withAdapter(adapterController.adapter);

            // Act
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            // Assert
            const exceptionsBoxContainer = rootElement.querySelector('.nlux-comp-exp_box');
            expect(exceptionsBoxContainer).toBeInTheDocument();
        });

        it('Prompt-box container should render', async () => {
            // Arrange
            adapterController = adapterBuilder().withFetchText().create();
            aiChat = createAiChat().withAdapter(adapterController.adapter);

            // Act
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            // Assert
            const composerContainer = rootElement.querySelector('.nlux-comp-prmptBox');
            expect(composerContainer).toBeInTheDocument();
        });

        it('Conversation container should render', async () => {
            // Arrange
            adapterController = adapterBuilder().withFetchText().create();
            aiChat = createAiChat().withAdapter(adapterController.adapter);

            // Act
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            // Assert
            const conversationContainer = rootElement.querySelector('.nlux-chtRm-cnv-cntr');
            expect(conversationContainer).toBeInTheDocument();
        });

        it('Status should be "mounted"', async () => {
            // Arrange
            adapterController = adapterBuilder().withFetchText().create();
            aiChat = createAiChat().withAdapter(adapterController.adapter);

            // Act
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            // Assert
            expect(aiChat.status).toBe('mounted');
        });
    });

    describe('When mount() is called twice', () => {
        it('It should throw an error', async () => {
            // Arrange
            adapterController = adapterBuilder().withFetchText().create();
            aiChat = createAiChat().withAdapter(adapterController.adapter);

            // Act
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            // Assert
            expect(() => aiChat?.mount(rootElement)).toThrowError();
        });

        it('It should not render anything new in DOM', async () => {
            // Arrange
            adapterController = adapterBuilder().withFetchText().create();
            aiChat = createAiChat().withAdapter(adapterController.adapter);

            // Act
            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const initialHtmlRendered = rootElement?.innerHTML;
            try {
                aiChat.mount(rootElement);
                await waitForRenderCycle();
            } catch (_error) {
                // ignore
            }

            // Assert
            expect(rootElement?.innerHTML).toBe(initialHtmlRendered);
        });

        it('It should not change the status', async () => {
            // Arrange
            adapterController = adapterBuilder().withFetchText().create();
            aiChat = createAiChat().withAdapter(adapterController.adapter);

            // Act
            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const initialStatus = aiChat.status;
            try {
                aiChat.mount(rootElement);
                await waitForRenderCycle();
            } catch (_error) {
                // ignore
            }

            // Assert
            expect(aiChat.status).toBe(initialStatus);
        });
    });
});

