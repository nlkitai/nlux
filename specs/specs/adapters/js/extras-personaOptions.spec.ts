import {AiChat, createAiChat, PersonaOptions} from '@nlux-dev/core/src';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {waitForMilliseconds, waitForRenderCycle} from '../../../utils/wait';

describe.each([
    {dataTransferMode: 'batch'},
    {dataTransferMode: 'stream'},
] satisfies Array<{ dataTransferMode: 'stream' | 'batch' }>)(
    'createAiChat() + withAdapter($mode) + personaOptions extras',
    ({dataTransferMode}) => {
        let adapterController: AdapterController;
        let rootElement: HTMLElement;
        let aiChat: AiChat;

        // Assign fetch/stream adapters — Tests should work the same way
        const shouldUseBatch = dataTransferMode === 'batch';

        beforeEach(() => {
            adapterController = adapterBuilder()
                .withBatchText(shouldUseBatch)
                .withStreamText(!shouldUseBatch)
                .create();
            rootElement = document.createElement('div');
            document.body.append(rootElement);
        });

        afterEach(() => {
            aiChat?.unmount();
            rootElement?.remove();
        });

        it('Persona Options should be provided to the adapter as part of extras attribute', async () => {
            // Arrange
            const testPersonaOptions: PersonaOptions = {
                assistant: {
                    name: 'Test Assistant',
                    avatar: 'https://example.com/test-assistant-image.png',
                    tagline: 'Test Assistant Tagline',
                },
                user: {
                    name: 'Test User',
                    avatar: 'https://example.com/test-user-image.png',
                },
            };

            aiChat = createAiChat()
                .withAdapter(adapterController!.adapter)
                .withPersonaOptions(testPersonaOptions);

            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();

            // Assert
            expect(adapterController.getLastExtras()?.aiChatProps?.personaOptions)
                .toEqual(testPersonaOptions);
        });

        describe('When persona options are updated', () => {
            it('New options should be provided to the adapter as part of extras attribute', async () => {
                // Arrange
                const testPersonaOptions: PersonaOptions = {
                    assistant: {
                        name: 'Test Assistant',
                        avatar: 'https://example.com/test-assistant-image.png',
                        tagline: 'Test Assistant Tagline',
                    },
                    user: {
                        name: 'Test User',
                        avatar: 'https://example.com/test-user-image.png',
                    },
                };

                const newPersonaOptions: PersonaOptions = {
                    assistant: {
                        name: 'New Assistant',
                        avatar: 'https://example.com/new-assistant-image.png',
                        tagline: 'New Assistant Tagline',
                    },
                    user: {
                        name: 'New User',
                        avatar: 'https://example.com/new-user-image.png',
                    },
                };

                aiChat = createAiChat()
                    .withAdapter(adapterController!.adapter)
                    .withPersonaOptions(testPersonaOptions);

                aiChat.mount(rootElement);
                await waitForRenderCycle();

                const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;
                await userEvent.type(textArea, 'Hello{enter}');
                await waitForRenderCycle();

                adapterController.resolve('Cheers!');
                adapterController.complete();
                await waitForMilliseconds(100);

                // Act
                aiChat.updateProps({
                    personaOptions: newPersonaOptions,
                });

                textArea.focus();
                await waitForRenderCycle();

                await userEvent.type(textArea, 'Bonjour{enter}');
                await waitForMilliseconds(100);

                // Assert
                expect(
                    adapterController.getLastExtras()?.aiChatProps.personaOptions,
                ).toEqual(newPersonaOptions);
            });
        });
    },
);
