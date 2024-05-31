import {AiChat, createAiChat} from '@nlux-dev/core/src';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {waitForRenderCycle} from '../../../utils/wait';

describe('createAiChat() + conversationOptions + conversationStarters', () => {
    let adapterController: AdapterController | undefined;
    let rootElement: HTMLElement;
    let aiChat: AiChat | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder().withBatchText().create();
        rootElement = document.createElement('div');
        document.body.append(rootElement);
    });

    afterEach(() => {
        adapterController = undefined;
        aiChat?.unmount();
        rootElement?.remove();
        aiChat = undefined;
    });

    describe('When conversationStarters are provided', () => {
        it.todo('They should be displayed when the conversation is empty', async () => {
        });

        describe('When the user submits a prompt', () => {
            it.todo('The conversationStarters should not be displayed', async () => {
            });

            describe('When the prompt submission fails', () => {
                it.todo('The conversationStarters should be displayed again', async () => {
                });
            });
        });
    });

    describe('When conversationStarters are not provided', () => {
        it.todo('They should not be displayed when the conversation is empty', async () => {
        });
    });

    describe('When conversationStarters are provided and the conversation is not empty', () => {
        it.todo('They should not be displayed', async () => {
        });
    });
});
