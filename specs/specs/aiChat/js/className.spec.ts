import {AiChat, createAiChat} from '@nlux-dev/core/src';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {waitForRenderCycle} from '../../../utils/wait';

describe('createAiChat() + className', () => {
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

    describe('When the component is created without a className', () => {
        it('The default className should be used', async () => {
            // Given
            aiChat = createAiChat().withAdapter(adapterController!.adapter);

            // When
            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const aiChatDom = rootElement.querySelector('.nlux-AiChat-root')!;

            // Then
            expect(aiChatDom.classList.length).toBe(2);
            expect(aiChatDom.classList[0]).toBe('nlux-AiChat-root');
            expect(aiChatDom.classList[1]).toBe('nlux-theme-luna');
        });

        describe('When a className is set', () => {
            it('The new className should be used', async () => {
                // Given
                aiChat = createAiChat().withAdapter(adapterController!.adapter);
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                // When
                aiChat.updateProps({className: 'my-class'});
                await waitForRenderCycle();
                const aiChatDom = rootElement.querySelector('.nlux-AiChat-root')!;

                // Then
                expect(aiChatDom.classList.length).toBe(3);
                expect(aiChatDom.classList[0]).toBe('nlux-AiChat-root');
                expect(aiChatDom.classList[1]).toBe('nlux-theme-luna');
                expect(aiChatDom.classList[2]).toBe('my-class');
            });
        });
    });

    describe('When the component is created with a className', () => {
        it('The className should be used', async () => {
            // Given
            aiChat = createAiChat().withAdapter(adapterController!.adapter).withClassName('my-class');

            // When
            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const aiChatDom = rootElement.querySelector('.nlux-AiChat-root')!;

            // Then
            expect(aiChatDom.classList.length).toBe(3);
            expect(aiChatDom.classList[0]).toBe('nlux-AiChat-root');
            expect(aiChatDom.classList[1]).toBe('nlux-theme-luna');
            expect(aiChatDom.classList[2]).toBe('my-class');
        });

        describe('When a different className is set', () => {
            it('The new className should be used', async () => {
                // Given
                aiChat = createAiChat().withAdapter(adapterController!.adapter).withClassName('my-class');
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                // When
                aiChat.updateProps({className: 'my-new-class'});
                await waitForRenderCycle();
                const aiChatDom = rootElement.querySelector('.nlux-AiChat-root')!;

                // Then
                expect(aiChatDom.classList.length).toBe(3);
                expect(aiChatDom.classList[0]).toBe('nlux-AiChat-root');
                expect(aiChatDom.classList[1]).toBe('nlux-theme-luna');
                expect(aiChatDom.classList[2]).toBe('my-new-class');
            });
        });

        describe('When the className is removed', () => {
            it('The default className should be used', async () => {
                // Given
                aiChat = createAiChat().withAdapter(adapterController!.adapter).withClassName('my-class');
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                // When
                aiChat.updateProps({className: undefined});
                await waitForRenderCycle();
                const aiChatDom = rootElement.querySelector('.nlux-AiChat-root')!;

                // Then
                expect(aiChatDom.classList.length).toBe(2);
                expect(aiChatDom.classList[0]).toBe('nlux-AiChat-root');
                expect(aiChatDom.classList[1]).toBe('nlux-theme-luna');
            });
        });
    });
});