import {AiChat} from '@nlux/core';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {queries} from '../../../utils/selectors';
import {waitForRenderCycle} from '../../../utils/wait';

describe('When AiChat box is created with conversation history', () => {
    let adapterController: AdapterController;
    let rootElement: HTMLElement;
    let aiChat: AiChat;

    beforeEach(() => {
        rootElement = document.createElement('div');
        document.body.append(rootElement);
    });

    afterEach(() => {
        aiChat?.unmount();
        rootElement?.remove();
    });

    describe('When the AiChat component renders', () => {
        it('it should show the conversation history messages', async () => {
            adapterController = adapterBuilder().withFetchText().create();

            aiChat = new AiChat()
                .withAdapter(adapterController.adapter)
                .withLayoutOptions({height: '200px'})
                .withConversationHistory([
                    {message: 'Hello AI!', role: 'user'},
                    {message: 'Hi user!', role: 'ai'},
                ]);

            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const messagesContainer = queries.conversationMessagesContainer();

            expect(messagesContainer).toContainHTML('Hello AI');
            expect(messagesContainer).toContainHTML('Hi user');

            expect(queries.sentMessagePersonaContainer()).not.toBeInTheDocument();
            expect(queries.receivedMessagePersonaContainer()).not.toBeInTheDocument();
        });

        it('should render persona profile pictures when provided', async () => {
            adapterController = adapterBuilder().withFetchText().create();

            aiChat = new AiChat()
                .withAdapter(adapterController.adapter)
                .withLayoutOptions({height: '200px'})
                .withPersonaOptions({
                    bot: {
                        name: 'Bot',
                        picture: 'https://i.imgur.com/7QuesI3.png',
                    },
                    user: {
                        name: 'User',
                        picture: 'https://i.imgur.com/7QuesI3.png',
                    },
                })
                .withConversationHistory([
                    {message: 'Hello AI!', role: 'user'},
                    {message: 'Hi user!', role: 'ai'},
                ]);

            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const messagesContainer = queries.conversationMessagesContainer();
            expect(messagesContainer).toContainHTML('Hello AI');
            expect(messagesContainer).toContainHTML('Hi user');

            expect(queries.sentMessagePersonaContainer()).toBeInTheDocument();
            expect(queries.receivedMessagePersonaContainer()).toBeInTheDocument();
        });
    });
});
