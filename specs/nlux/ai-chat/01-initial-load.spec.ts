import {AdapterBuilder, createAiChat, AiChat} from '@nlux/core';
import '@testing-library/jest-dom';
import {AdapterController, createPromiseAdapterController} from '../../utils/adapters';
import {queries} from '../../utils/selectors';
import {waitForRenderCycle} from '../../utils/wait';

const apiKey = 'YOUR_API_KEY_HERE';

describe('On AiChat initial load', () => {
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

    it('should not initially render anything is DOM', async () => {
        adapterController = createPromiseAdapterController();
        aiChat = createAiChat().withAdapter(adapterController.adapter);
        await waitForRenderCycle();
        expect(rootElement?.innerHTML).toBe('');
    });

    describe('When mount() is called', () => {
        it('chat room container should render', async () => {
            adapterController = createPromiseAdapterController();
            aiChat = createAiChat().withAdapter(adapterController.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            expect(queries.chatRoom()).toBeInTheDocument();
        });

        it('exceptions box container should render', async () => {
            adapterController = createPromiseAdapterController();
            aiChat = createAiChat().withAdapter(adapterController.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            expect(queries.exceptionsBox()).toBeInTheDocument();
        });

        it('prompt box container should render', async () => {
            adapterController = createPromiseAdapterController();
            aiChat = createAiChat().withAdapter(adapterController.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            expect(queries.promptBoxContainer()).toBeInTheDocument();
        });

        it('conversation container should render', async () => {
            adapterController = createPromiseAdapterController();
            aiChat = createAiChat().withAdapter(adapterController.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            expect(queries.conversationContainer()).toBeInTheDocument();
        });
    });

    describe('When mount() is called twice', () => {
        it('should throw an error', async () => {
            adapterController = createPromiseAdapterController();
            aiChat = createAiChat().withAdapter(adapterController.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            expect(() => aiChat?.mount(rootElement)).toThrowError();
        });

        it('should not render anything new in DOM', async () => {
            adapterController = createPromiseAdapterController();
            aiChat = createAiChat().withAdapter(adapterController.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const initialHtmlRendered = rootElement?.innerHTML;

            try {
                aiChat.mount(rootElement);
                await waitForRenderCycle();
            } catch (e) {
                // ignore
            }

            expect(rootElement?.innerHTML).toBe(initialHtmlRendered);
        });
    });
});

