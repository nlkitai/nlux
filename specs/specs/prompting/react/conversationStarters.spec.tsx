import {ComposerOptions} from '@nlux-dev/core/src';
import {AiChat} from '@nlux-dev/react/src';
import {ConversationStarter} from '@nlux-dev/react/src/types/conversationStarter';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {waitForReactRenderCycle, waitForRenderCycle} from '../../../utils/wait';

describe('<AiChat /> + conversationOptions + conversationStarters', () => {
    let adapterController: AdapterController | undefined;
    let rootElement: HTMLElement;

    beforeEach(() => {
        adapterController = adapterBuilder().withBatchText().create();
        rootElement = document.createElement('div');
        document.body.append(rootElement);
    });

    afterEach(() => {
        adapterController = undefined;
        rootElement?.remove();
    });

    describe('When conversationStarters are provided', () => {
        it('They should be displayed when the conversation is empty', async () => {
            // Arrange
            const conversationStarters: ConversationStarter[] = [
                {prompt: 'Hello, World!'},
                {prompt: 'How are you?'},
            ];

            // Act
            const {container} = render(
                <AiChat
                    adapter={adapterController!.adapter}
                    conversationOptions={{conversationStarters}}
                />,
            );
            await waitForReactRenderCycle();

            // Assert
            const conversationStarterElements = container.querySelectorAll('.nlux-comp-convStrt');
            expect(conversationStarterElements).toHaveLength(conversationStarters.length);
            conversationStarterElements.forEach((conversationStarterElement, index) => {
                expect(conversationStarterElement).toHaveTextContent(conversationStarters[index].prompt);
            });
        });

        describe('When conversationStarters are removed after initial render', () => {
            it('They should not be displayed', async () => {
                // Arrange
                const conversationStarters: ConversationStarter[] = [
                    {prompt: 'Hello, World!'},
                    {prompt: 'How are you?'},
                ];

                // Act
                const {container, rerender} = render(
                    <AiChat
                        adapter={adapterController!.adapter}
                        conversationOptions={{conversationStarters}}
                    />,
                );
                await waitForReactRenderCycle();

                // Assert
                let conversationStarterElements = container.querySelectorAll('.nlux-comp-convStrt');
                expect(conversationStarterElements).toHaveLength(conversationStarters.length);

                // Act
                rerender(
                    <AiChat
                        adapter={adapterController!.adapter}
                    />,
                );
                await waitForReactRenderCycle();

                // Assert
                conversationStarterElements = container.querySelectorAll('.nlux-comp-convStrt');
                expect(conversationStarterElements).toHaveLength(0);
            });
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
        it('They should not be displayed when the conversation is empty', async () => {
            // Act
            const {container} = render(
                <AiChat
                    adapter={adapterController!.adapter}
                />,
            );
            await waitForReactRenderCycle();

            // Assert
            const conversationStarterElements = container.querySelectorAll('.nlux-comp-convStrt');
            expect(conversationStarterElements).toHaveLength(0);
        });
    });

    describe('When conversationStarters are provided and the conversation is not empty', () => {
        it.todo('They should not be displayed', async () => {
        });
    });
});
