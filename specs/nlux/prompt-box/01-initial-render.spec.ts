import {createAiChat, AiChat} from '@nlux/core';
import {AdapterController, createPromiseAdapterController} from '../../utils/adapters';
import '@testing-library/jest-dom';
import {queries} from '../../utils/selectors';
import {waitForRenderCycle} from '../../utils/wait';

describe('On AiChat is mounted without options', () => {
    let adapterController: AdapterController | undefined = undefined;

    let rootElement: HTMLElement | undefined;
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
        rootElement = undefined;
    });

    describe('Prompt Box', () => {
        it('should render', async () => {
            adapterController = createPromiseAdapterController();
            aiChat = createAiChat().withAdapter(adapterController.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();
            expect(queries.promptBoxContainer()).toBeInTheDocument();
        });

        it('should render text box for prompt input', async () => {
            adapterController = createPromiseAdapterController();
            aiChat = createAiChat().withAdapter(adapterController.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();
            expect(queries.promptBoxTextInput()).toBeInTheDocument();
        });

        it('should render button to submit prompt', async () => {
            adapterController = createPromiseAdapterController();
            aiChat = createAiChat().withAdapter(adapterController.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();
            expect(queries.promptBoxSendButton()).toBeInTheDocument();
        });

        describe('Text Input', () => {
            it('should be enabled', async () => {
                adapterController = createPromiseAdapterController();
                aiChat = createAiChat().withAdapter(adapterController.adapter);
                aiChat.mount(rootElement);
                await waitForRenderCycle();
                expect(queries.promptBoxTextInput()).not.toBeDisabled();
            });

            it('should be empty', async () => {
                adapterController = createPromiseAdapterController();
                aiChat = createAiChat().withAdapter(adapterController.adapter);
                aiChat.mount(rootElement);
                await waitForRenderCycle();
                expect(queries.promptBoxTextInput()).toHaveValue('');
            });

            it('should not be focused', async () => {
                adapterController = createPromiseAdapterController();
                aiChat = createAiChat().withAdapter(adapterController.adapter);
                aiChat.mount(rootElement);
                await waitForRenderCycle();
                expect(queries.promptBoxTextInput()).not.toHaveFocus();
            });
        });

        describe('Submit Button', () => {
            it('should be disabled', async () => {
                adapterController = createPromiseAdapterController();
                aiChat = createAiChat().withAdapter(adapterController.adapter);
                aiChat.mount(rootElement);
                await waitForRenderCycle();
                expect(queries.promptBoxTextInput()).not.toBeDisabled();
            });
        });
    });
});
