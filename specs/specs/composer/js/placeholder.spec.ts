import {AiChat, createAiChat, ComposerOptions} from '@nlux-dev/core/src';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {waitForRenderCycle} from '../../../utils/wait';

describe('createAiChat() + composer + placeholder', () => {
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

    describe('When no placeholder option is initially provided', () => {
        it('The composer should be rendered without a placeholder', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            // Act
            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;

            // Assert
            expect(textArea.placeholder).toBe('');
        });

        describe('When a placeholder option is added', () => {
            it('The composer should be rendered with a placeholder', async () => {
                // Arrange
                aiChat = createAiChat().withAdapter(adapterController!.adapter);
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                // Act
                aiChat.updateProps({composerOptions: {placeholder: 'My composer'}});
                await waitForRenderCycle();
                const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;

                // Assert
                expect(textArea.placeholder).toBe('My composer');
            });
        });
    });

    describe('When the component is created with placeholder option', () => {
        it('The composer should be rendered with a placeholder', async () => {
            // Arrange
            const composerOptions: ComposerOptions = {placeholder: 'My composer'};
            aiChat = createAiChat().withAdapter(adapterController!.adapter).withComposerOptions(composerOptions);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            // Act
            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;

            // Assert
            expect(textArea.placeholder).toBe('My composer');
        });
    });
});
