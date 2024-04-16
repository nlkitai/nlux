import {AiChat, createAiChat} from '@nlux-dev/core/src';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {waitForMilliseconds, waitForRenderCycle} from '../../../utils/wait';

describe('createAiChat() + promptBox focus', () => {
    let adapterController: AdapterController | undefined;
    let rootElement: HTMLElement;
    let aiChat: AiChat | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder().withFetchText().withStreamText(false).create();
        rootElement = document.createElement('div');
        document.body.append(rootElement);
    });

    afterEach(() => {
        adapterController = undefined;
        aiChat?.unmount();
        rootElement?.remove();
        aiChat = undefined;
    });

    describe('When the AiChat is created without autoFocus', () => {
        it('The prompt box should not be focused', async () => {
            // Given
            aiChat = createAiChat().withAdapter(adapterController!.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            // When
            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;

            // Then
            expect(document.activeElement).not.toBe(textArea);
        });

        describe('When a message is sent then focus is lost', () => {
            it('The prompt box should not be focused when a response is received', async () => {
                // Given
                aiChat = createAiChat().withAdapter(adapterController!.adapter);
                aiChat.mount(rootElement);
                await waitForRenderCycle();
                const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;

                // When
                await userEvent.type(textArea, 'Hello{enter}');
                adapterController?.resolve('Response');
                textArea.blur();
                await waitForRenderCycle();

                // Then
                expect(document.activeElement).not.toBe(textArea);
            });
        });
    });

    describe('When the AiChat is created with autoFocus', () => {
        it('The prompt box should be focused', async () => {
            // Given
            aiChat = createAiChat()
                .withAdapter(adapterController!.adapter)
                .withPromptBoxOptions({
                    autoFocus: true,
                });

            aiChat.mount(rootElement);
            await waitForRenderCycle();

            // When
            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;

            // Then
            expect(textArea.autofocus).toBe(true);

            // JSDom does not support autofocus,
            // so we check the autofocus attribute instead of the activeElement
            // expect(document.activeElement).toBe(textArea);
        });

        describe('When a message is sent then focus is lost', () => {
            it('The prompt box should be re-focused when a response is received', async () => {
                // Given
                aiChat = createAiChat()
                    .withAdapter(adapterController!.adapter)
                    .withPromptBoxOptions({
                        autoFocus: true,
                    });
                aiChat.mount(rootElement);
                await waitForRenderCycle();
                const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
                textArea.blur();

                // When
                await userEvent.type(textArea, 'Hello{enter}');
                adapterController?.resolve('Response');
                await waitForRenderCycle();

                // Then
                expect(document.activeElement).toBe(textArea);
            });

            it('The prompt box should be re-focused after submission error', async () => {
                // Given
                aiChat = createAiChat()
                    .withAdapter(adapterController!.adapter)
                    .withPromptBoxOptions({
                        autoFocus: true,
                    });
                aiChat.mount(rootElement);
                await waitForRenderCycle();
                const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;

                // When
                await userEvent.type(textArea, 'Hello{enter}');
                textArea.blur();
                adapterController?.reject('Error message');
                await waitForMilliseconds(100);

                // Then
                expect(document.activeElement).toBe(textArea);
            });
        });
    });
});
