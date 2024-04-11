import {AiChat, createAiChat} from '@nlux-dev/core/src';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {waitForRenderCycle} from '../../../utils/wait';

describe('createAiChat() + promptBox', () => {
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

    describe('When the component is created', () => {
        it('The promptBox should be rendered', async () => {
            // Given
            aiChat = createAiChat().withAdapter(adapterController!.adapter);

            // When
            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const promptBox = rootElement.querySelector('.nlux-comp-prmptBox');

            // Then
            expect(promptBox).not.toBeFalsy();
        });

        it('The promptBox should contain text area', async () => {
            // Given
            aiChat = createAiChat().withAdapter(adapterController!.adapter);

            // When
            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const textArea = rootElement.querySelector('.nlux-comp-prmptBox > textarea');

            // Then
            expect(textArea).not.toBeFalsy();
        });

        it('The promptBox should contain send button', async () => {
            // Given
            aiChat = createAiChat().withAdapter(adapterController!.adapter);

            // When
            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const sendButton = rootElement.querySelector('.nlux-comp-prmptBox > button');

            // Then
            expect(sendButton).not.toBeFalsy();
        });
    });
});
