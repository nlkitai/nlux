import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {render} from '@testing-library/react';
import {AiChat, AiChatApi, useAiChatApi} from '@nlux-dev/react/src';
import {AdapterController} from '../../../utils/adapters';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {waitForReactRenderCycle} from '../../../utils/wait';
import {act} from 'react';

describe('<AiChat /> + api + reset', () => {
    let adapterController: AdapterController | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder()
            .withBatchText(true)
            .withStreamText(false)
            .create();
    });

    afterEach(() => {
        adapterController = undefined;
    });

    describe('When resetConversation is called', () => {
        it('It should clear the chat segments', async () => {
            // Arrange
            let apiFromOutside: AiChatApi | undefined = undefined;
            let containerFromOutside: HTMLElement | undefined = undefined;

            const Comp = () => {
                const api = useAiChatApi();
                apiFromOutside = api;

                return (
                    <AiChat
                        api={api}
                        adapter={adapterController!.adapter}
                        personaOptions={{
                            assistant: {
                                name: 'Assistant',
                                avatar: 'https://example.com/assistant.png',
                                tagline: 'Welcome to the chat',
                            },
                        }}
                        initialConversation={[
                            {
                                role: 'assistant',
                                message: 'Hello, world!',
                            },
                            {
                                role: 'user',
                                message: 'Hi, assistant!',
                            },
                        ]}
                    />
                );
            };

            // Act
            await act(async () => {
                const {container} = render(<Comp/>);
                containerFromOutside = container;
            });
            await waitForReactRenderCycle();

            // Assert
            expect(apiFromOutside).toBeDefined();
            expect(containerFromOutside).toBeDefined();
            expect(containerFromOutside!.textContent).toContain('Hello, world!');

            // Act
            act(() => apiFromOutside!.resetConversation());
            await waitForReactRenderCycle();

            // Assert
            const welcomeMessage = containerFromOutside!.querySelector('.nlux-comp-welcomeMessage');
            expect(welcomeMessage).not.toBeNull();
            expect(welcomeMessage!.textContent).not.toContain('Hello, world!');
        });
    });
});
