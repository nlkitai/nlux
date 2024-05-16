import {AiChat, createAiChat} from '@nlux-dev/core/src';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForRenderCycle} from '../../../../utils/wait';

describe('createAiChat() + displayOptions + width', () => {
    let adapterController: AdapterController | undefined;
    let rootElement: HTMLElement;
    let aiChat: AiChat | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder().withFetchText().create();
        rootElement = document.createElement('div');
        document.body.append(rootElement);
    });

    afterEach(() => {
        adapterController = undefined;
        aiChat?.unmount();
        rootElement?.remove();
        aiChat = undefined;
    });

    describe('When the component is created without a width', () => {
        it('No width should be set at the root element', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter);

            // Act
            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const aiChatDom: HTMLElement = rootElement.querySelector('.nlux-AiChat-root')!;

            // Assert
            expect(aiChatDom.style.width).toBe('');
        });

        describe('When a width is set after the component is created', () => {
            it('The width should be set with as a number at the root element', async () => {
                // Arrange
                aiChat = createAiChat().withAdapter(adapterController!.adapter);
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                // Act
                aiChat.updateProps({displayOptions: {width: 500}});
                await waitForRenderCycle();
                const aiChatDom: HTMLElement = rootElement.querySelector('.nlux-AiChat-root')!;

                // Assert
                expect(aiChatDom.style.width).toBe('500px');
            });

            it('The width should be set with as a string at the root element', async () => {
                // Arrange
                aiChat = createAiChat().withAdapter(adapterController!.adapter);
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                // Act
                aiChat.updateProps({displayOptions: {width: '500px'}});
                await waitForRenderCycle();
                const aiChatDom: HTMLElement = rootElement.querySelector('.nlux-AiChat-root')!;

                // Assert
                expect(aiChatDom.style.width).toBe('500px');
            });
        });
    });

    describe('When the component is created with a width', () => {
        it('The width should be set with as a number at the root element', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter).withDisplayOptions({width: 500});

            // Act
            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const aiChatDom: HTMLElement = rootElement.querySelector('.nlux-AiChat-root')!;

            // Assert
            expect(aiChatDom.style.width).toBe('500px');
        });

        it('The width should be set with as a string at the root element', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter).withDisplayOptions({width: '500px'});

            // Act
            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const aiChatDom: HTMLElement = rootElement.querySelector('.nlux-AiChat-root')!;

            // Assert
            expect(aiChatDom.style.width).toBe('500px');
        });

        describe('When a width is updated after the component is created', () => {
            it('The width should be updated with as a number at the root element', async () => {
                // Arrange
                aiChat = createAiChat().withAdapter(adapterController!.adapter).withDisplayOptions({width: 500});
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                // Act
                aiChat.updateProps({displayOptions: {width: 600}});
                await waitForRenderCycle();
                const aiChatDom: HTMLElement = rootElement.querySelector('.nlux-AiChat-root')!;

                // Assert
                expect(aiChatDom.style.width).toBe('600px');
            });

            it('The width should be updated with as a string at the root element', async () => {
                // Arrange
                aiChat = createAiChat().withAdapter(adapterController!.adapter).withDisplayOptions({width: 500});
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                // Act
                aiChat.updateProps({displayOptions: {width: '600px'}});
                await waitForRenderCycle();
                const aiChatDom: HTMLElement = rootElement.querySelector('.nlux-AiChat-root')!;

                // Assert
                expect(aiChatDom.style.width).toBe('600px');
            });
        });

        describe('When the width is removed after the component is created', () => {
            it('No width should be set at the root element', async () => {
                // Arrange
                aiChat = createAiChat().withAdapter(adapterController!.adapter).withDisplayOptions({width: 500});
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                // Act
                aiChat.updateProps({displayOptions: {width: undefined}});
                await waitForRenderCycle();
                const aiChatDom: HTMLElement = rootElement.querySelector('.nlux-AiChat-root')!;

                // Assert
                expect(aiChatDom.style.width).toBe('');
            });
        });
    });
});
