import {createAiChat, AiChat} from '@nlux/core';
import userEvent from '@testing-library/user-event';
import {AdapterController, createPromiseAdapterController} from '../../utils/adapters';
import {queries} from '../../utils/selectors';
import {waitForRenderCycle} from '../../utils/wait';

describe('When a component is loaded', () => {
    let adapterController: AdapterController | undefined;
    let rootElement: HTMLElement | undefined;
    let aiChat: AiChat | undefined;

    beforeEach(() => {
        rootElement = document.createElement('div');
        document.body.append(rootElement);
    });

    afterEach(() => {
        aiChat?.unmount();
        rootElement?.remove();
        aiChat = undefined;
        rootElement = undefined;
        adapterController = undefined;
    });

    describe('When the custom adapter provided implements both fetchText and streamText methods', () => {
        beforeEach(() => {
            adapterController = createPromiseAdapterController({
                includeFetchText: true,
                includeStreamText: true,
            });
        });

        it('streamText should be used', async () => {
            aiChat = createAiChat().withAdapter(adapterController.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textInput: any = queries.promptBoxTextInput() as any;
            const sendButton: any = queries.promptBoxSendButton() as any;

            await userEvent.type(textInput, 'Hello');
            await waitForRenderCycle();

            await userEvent.click(sendButton);
            await waitForRenderCycle();

            expect(adapterController.streamTextMock).toHaveBeenCalledWith('Hello', expect.anything());
            expect(adapterController.fetchTextMock).toHaveBeenCalledTimes(0);
        });
    });

    describe('When the custom adapter provided implements only the fetchText method', () => {
        beforeEach(() => {
            adapterController = createPromiseAdapterController({
                includeFetchText: true,
                includeStreamText: false,
            });
        });

        it('fetchText should be used', async () => {
            aiChat = createAiChat().withAdapter(adapterController.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textInput: any = queries.promptBoxTextInput() as any;
            const sendButton: any = queries.promptBoxSendButton() as any;

            await userEvent.type(textInput, 'Hello');
            await waitForRenderCycle();

            await userEvent.click(sendButton);
            await waitForRenderCycle();

            expect(adapterController.fetchTextMock).toHaveBeenCalledWith('Hello');
            expect(adapterController.streamTextMock).toHaveBeenCalledTimes(0);
        });
    });

    describe('When the custom adapter provided implements only the streamText method', () => {
        beforeEach(() => {
            adapterController = createPromiseAdapterController({
                includeFetchText: false,
                includeStreamText: true,
            });
        });

        it('streamText should be used', async () => {
            aiChat = createAiChat().withAdapter(adapterController.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textInput: any = queries.promptBoxTextInput() as any;
            const sendButton: any = queries.promptBoxSendButton() as any;

            await userEvent.type(textInput, 'Hello');
            await waitForRenderCycle();

            await userEvent.click(sendButton);
            await waitForRenderCycle();

            expect(adapterController.streamTextMock).toHaveBeenCalledWith('Hello', expect.anything());
            expect(adapterController.fetchTextMock).toHaveBeenCalledTimes(0);
        });
    });

    describe('When the custom adapter provided implements none of the fetch/streamText methods', () => {
        beforeEach(() => {
            adapterController = createPromiseAdapterController({
                includeFetchText: false,
                includeStreamText: false,
            });
        });

        it('should throw an error', () => {
            expect(() => createAiChat().withAdapter(adapterController.adapter)).toThrowError();
        });
    });

    describe('When no adapter is provided', () => {
        it('should throw an error on mount', () => {
            aiChat = createAiChat();
            expect(() => aiChat.mount(rootElement)).toThrowError();
        });
    });

    describe('When invalid object is provided', () => {
        it('should throw an error as soon as the invalid adapter is set', () => {
            expect(() => createAiChat().withAdapter(undefined)).toThrowError();
            expect(() => createAiChat().withAdapter(null as any)).toThrowError();
            expect(() => createAiChat().withAdapter(123 as any)).toThrowError();
            expect(() => createAiChat().withAdapter('' as any)).toThrowError();
        });
    });
});
