import {AiChat, createAiChat} from '@nlux-dev/core/src';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {waitForRenderCycle} from '../../../utils/wait';

describe('createAiChat() + composer + autoFocus', () => {
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

    describe('When no autoFocus option is initially provided', () => {
        it('The textarea should be rendered without autoFocus', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            // Act
            const composer: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;

            // Assert
            expect(composer.autofocus).toEqual(false);
        });

        describe('When autoFocus option is set to true after initial render', () => {
            it('The textarea should be rendered with autoFocus', async () => {
                // Arrange
                aiChat = createAiChat().withAdapter(adapterController!.adapter);
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                // Act
                aiChat.updateProps({composerOptions: {autoFocus: true}});
                await waitForRenderCycle();

                // Assert
                const composer: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;
                expect(composer.autofocus).toEqual(true);
            });
        });
    });

    describe('When autoFocus option is initially set to true', () => {
        it('The textarea should be rendered with autoFocus', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter).withComposerOptions({autoFocus: true});
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            // Act
            const composer: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;

            // Assert
            expect(composer.autofocus).toEqual(true);
        });

        describe('When autoFocus option is set to false after initial render', () => {
            it('The textarea should be rendered without autoFocus', async () => {
                // Arrange
                aiChat = createAiChat().withAdapter(adapterController!.adapter).withComposerOptions({autoFocus: true});
                aiChat.mount(rootElement);
                await waitForRenderCycle();

                // Act
                aiChat.updateProps({composerOptions: {autoFocus: false}});
                await waitForRenderCycle();

                // Assert
                const composer: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-composer > textarea')!;
                expect(composer.autofocus).toEqual(false);
            });
        });
    });
});
