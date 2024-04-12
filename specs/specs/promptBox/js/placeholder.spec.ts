import {AiChat, createAiChat} from '@nlux-dev/core/src';
import {PromptBoxOptions} from '@nlux/core';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {waitForRenderCycle} from '../../../utils/wait';

describe('createAiChat() + promptBox + placeholder', () => {
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

    describe('When no placeholder option is initially provided', () => {
        it('The promptBox should be rendered without a placeholder', async () => {
            // Given
            aiChat = createAiChat().withAdapter(adapterController!.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            // When
            const textArea: HTMLTextAreaElement = document.querySelector('.nlux-comp-prmptBox > textarea')!;

            // Then
            expect(textArea.placeholder).toBe('');
        });

        describe('When a placeholder option is added', () => {
            it('The promptBox should be rendered with a placeholder', async () => {
                // Given
                aiChat = createAiChat().withAdapter(adapterController!.adapter);
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                // When
                aiChat.updateProps({promptBoxOptions: {placeholder: 'My prompt-box'}});
                await waitForRenderCycle();
                const textArea: HTMLTextAreaElement = document.querySelector('.nlux-comp-prmptBox > textarea')!;

                // Then
                expect(textArea.placeholder).toBe('My prompt-box');
            });
        });
    });

    describe('When the component is created with placeholder option', () => {
        it('The promptBox should be rendered with a placeholder', async () => {
            // Given
            const promptBoxOptions: PromptBoxOptions = {placeholder: 'My prompt-box'};
            aiChat = createAiChat().withAdapter(adapterController!.adapter).withPromptBoxOptions(promptBoxOptions);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            // When
            const textArea: HTMLTextAreaElement = document.querySelector('.nlux-comp-prmptBox > textarea')!;

            // Then
            expect(textArea.placeholder).toBe('My prompt-box');
        });
    });
});
