import {AiChat, createAiChat} from '@nlux/core';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {queries} from '../../../utils/selectors';
import {waitForRenderCycle} from '../../../utils/wait';

describe('On AiChat is mounted without options', () => {
    let adapterController: AdapterController;
    let rootElement: HTMLElement;
    let aiChat: AiChat;

    beforeEach(() => {
        adapterController = adapterBuilder().withFetchText().create();
        rootElement = document.createElement('div');
        document.body.append(rootElement);
    });

    afterEach(() => {
        aiChat?.unmount();
        rootElement?.remove();
    });

    describe('Prompt Box', () => {
        it('should render', async () => {
            aiChat = createAiChat().withAdapter(adapterController.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();
            expect(queries.promptBoxContainer()).toBeInTheDocument();
        });

        it('should render text box for prompt input', async () => {
            aiChat = createAiChat().withAdapter(adapterController.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();
            expect(queries.promptBoxTextInput()).toBeInTheDocument();
        });

        it('should render button to submit prompt', async () => {
            aiChat = createAiChat().withAdapter(adapterController.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();
            expect(queries.promptBoxSendButton()).toBeInTheDocument();
        });

        describe('Text Input', () => {
            it('should be enabled', async () => {
                aiChat = createAiChat().withAdapter(adapterController.adapter);
                aiChat.mount(rootElement);
                await waitForRenderCycle();
                expect(queries.promptBoxTextInput()).not.toBeDisabled();
            });

            it('should be empty', async () => {
                aiChat = createAiChat().withAdapter(adapterController.adapter);
                aiChat.mount(rootElement);
                await waitForRenderCycle();
                expect(queries.promptBoxTextInput()).toHaveValue('');
            });

            it('should not be focused', async () => {
                aiChat = createAiChat().withAdapter(adapterController.adapter);
                aiChat.mount(rootElement);
                await waitForRenderCycle();
                expect(queries.promptBoxTextInput()).not.toHaveFocus();
            });
        });

        describe('Submit Button', () => {
            it('should be disabled', async () => {
                aiChat = createAiChat().withAdapter(adapterController.adapter);
                aiChat.mount(rootElement);
                await waitForRenderCycle();
                expect(queries.promptBoxTextInput()).not.toBeDisabled();
            });
        });
    });
});
