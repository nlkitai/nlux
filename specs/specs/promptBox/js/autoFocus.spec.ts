import {AiChat, createAiChat} from '@nlux-dev/core/src';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {waitForRenderCycle} from '../../../utils/wait';

describe('createAiChat() + promptBox + autoFocus', () => {
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

    describe('When no autoFocus option is initially provided', () => {
        it('The textarea should be rendered without autoFocus', async () => {
            // Given
            aiChat = createAiChat().withAdapter(adapterController!.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            // When
            const promptBox: HTMLTextAreaElement = document.querySelector('.nlux-comp-prmptBox > textarea')!;

            // Then
            expect(promptBox.autofocus).toEqual(false);
        });

        describe('When autoFocus option is set to true after initial render', () => {
            it('The textarea should be rendered with autoFocus', async () => {
                // Given
                aiChat = createAiChat().withAdapter(adapterController!.adapter);
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                // When
                aiChat.updateProps({promptBoxOptions: {autoFocus: true}});
                await waitForRenderCycle();

                // Then
                const promptBox: HTMLTextAreaElement = document.querySelector('.nlux-comp-prmptBox > textarea')!;
                expect(promptBox.autofocus).toEqual(true);
            });
        });
    });

    describe('When autoFocus option is initially set to true', () => {
        it('The textarea should be rendered with autoFocus', async () => {
            // Given
            aiChat = createAiChat().withAdapter(adapterController!.adapter).withPromptBoxOptions({autoFocus: true});
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            // When
            const promptBox: HTMLTextAreaElement = document.querySelector('.nlux-comp-prmptBox > textarea')!;

            // Then
            expect(promptBox.autofocus).toEqual(true);
        });

        describe('When autoFocus option is set to false after initial render', () => {
            it('The textarea should be rendered without autoFocus', async () => {
                // Given
                aiChat = createAiChat().withAdapter(adapterController!.adapter).withPromptBoxOptions({autoFocus: true});
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                // When
                aiChat.updateProps({promptBoxOptions: {autoFocus: false}});
                await waitForRenderCycle();

                // Then
                const promptBox: HTMLTextAreaElement = document.querySelector('.nlux-comp-prmptBox > textarea')!;
                expect(promptBox.autofocus).toEqual(false);
            });
        });
    });
});
