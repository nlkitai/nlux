import {AiChat, createAiChat} from '@nlux-dev/core/src';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForMdStreamToComplete, waitForRenderCycle} from '../../../../utils/wait';

describe('createAiChat() + messageOptions + openMdLinksInNewWindow', () => {
    let adapterController: AdapterController | undefined = undefined;
    let rootElement: HTMLElement;
    let aiChat: AiChat | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder()
            .withFetchText(true)
            .withStreamText(false)
            .create();

        rootElement = document.createElement('div');
        document.body.append(rootElement);
    });

    afterEach(() => {
        adapterController = undefined;
        aiChat?.unmount();
        rootElement?.remove();
        aiChat = undefined;
    });

    describe('When openMdLinksInNewWindow is not set', () => {
        it('Markdown links should open in a new window', async () => {
            // Arrange
            aiChat = createAiChat()
                .withAdapter(adapterController!.adapter);

            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;

            await userEvent.type(textArea, 'Click [here](https://example.com){enter}');
            await waitForRenderCycle();

            // Act
            adapterController!.resolve('Click [here](https://example.com)');
            await waitForMdStreamToComplete(100);

            // Assert
            const markdownContainer = rootElement.querySelector('.nlux_cht_itm_in .nlux-md-cntr');
            expect(markdownContainer).toBeInTheDocument();

            const link = markdownContainer!.querySelector('a');
            expect(link).toBeInTheDocument();
            expect(link!.getAttribute('target')).toBe('_blank');
        });

        describe('When openMdLinksInNewWindow is updated to true after mounting', () => {
            it('Markdown links should open in a new window', async () => {
                // Arrange
                aiChat = createAiChat()
                    .withAdapter(adapterController!.adapter);

                aiChat.mount(rootElement);
                await waitForRenderCycle();
                const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;

                // Act
                aiChat.updateProps({messageOptions: {openMdLinksInNewWindow: true}});
                await waitForRenderCycle();

                await userEvent.type(textArea, 'Click [here](https://example.com){enter}');
                await waitForRenderCycle();

                adapterController!.resolve('Click [here](https://example.com)');
                await waitForMdStreamToComplete(100);

                // Assert
                const markdownContainer = rootElement.querySelector('.nlux_cht_itm_in .nlux-md-cntr');
                expect(markdownContainer).toBeInTheDocument();

                const link = markdownContainer!.querySelector('a');
                expect(link).toBeInTheDocument();
                expect(link!.getAttribute('target')).toBe('_blank');
            });
        });
    });

    describe('When openMdLinksInNewWindow is set to true', () => {
        it('Markdown links should open in a new window', async () => {
            // Arrange
            aiChat = createAiChat()
                .withMessageOptions({openMdLinksInNewWindow: true})
                .withAdapter(adapterController!.adapter);

            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;

            await userEvent.type(textArea, 'Click [here](https://example.com){enter}');
            await waitForRenderCycle();

            // Act
            adapterController!.resolve('Click [here](https://example.com)');
            await waitForMdStreamToComplete(100);

            // Assert
            const markdownContainer = rootElement.querySelector('.nlux_cht_itm_in .nlux-md-cntr');
            expect(markdownContainer).toBeInTheDocument();

            const link = markdownContainer!.querySelector('a');
            expect(link).toBeInTheDocument();
            expect(link!.getAttribute('target')).toBe('_blank');
        });

        describe('When openMdLinksInNewWindow is updated to false after mounting', () => {
            it.todo('Markdown links should not open in a new window', async () => {
                // Arrange
                aiChat = createAiChat()
                    .withAdapter(adapterController!.adapter);

                aiChat.mount(rootElement);
                await waitForRenderCycle();
                const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;

                // Act
                aiChat.updateProps({messageOptions: {openMdLinksInNewWindow: false}});
                await waitForRenderCycle();

                await userEvent.type(textArea, 'Click [here](https://example.com){enter}');
                await waitForRenderCycle();

                adapterController!.resolve('Click [here](https://example.com)');
                await waitForMdStreamToComplete(100);

                // Assert
                const markdownContainer = rootElement.querySelector('.nlux_cht_itm_in .nlux-md-cntr');
                expect(markdownContainer).toBeInTheDocument();

                const link = markdownContainer!.querySelector('a');
                expect(link).toBeInTheDocument();
                expect(link!.getAttribute('target')).toBeNull();
            });
        });
    });

    describe('When openMdLinksInNewWindow is set to false', () => {
        it('Markdown links should not open in a new window', async () => {
            // Arrange
            aiChat = createAiChat()
                .withMessageOptions({openMdLinksInNewWindow: false})
                .withAdapter(adapterController!.adapter);

            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;

            await userEvent.type(textArea, 'Click [here](https://example.com){enter}');
            await waitForRenderCycle();

            // Act
            adapterController!.resolve('Click [here](https://example.com)');
            await waitForMdStreamToComplete(100);

            // Assert
            const markdownContainer = rootElement.querySelector('.nlux_cht_itm_in .nlux-md-cntr');
            expect(markdownContainer).toBeInTheDocument();

            const link = markdownContainer!.querySelector('a');
            expect(link).toBeInTheDocument();
            expect(link!.getAttribute('target')).toBeNull();
        });

        describe('When openMdLinksInNewWindow is updated to true after mounting', () => {
            it.todo('Markdown links should open in a new window', async () => {
                // Arrange
                aiChat = createAiChat()
                    .withMessageOptions({openMdLinksInNewWindow: false})
                    .withAdapter(adapterController!.adapter);

                aiChat.mount(rootElement);
                await waitForRenderCycle();
                const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;

                // Act
                aiChat.updateProps({messageOptions: {openMdLinksInNewWindow: true}});
                await waitForRenderCycle();

                await userEvent.type(textArea, 'Click [here](https://example.com){enter}');
                await waitForRenderCycle();

                adapterController!.resolve('Click [here](https://example.com)');
                await waitForMdStreamToComplete(100);

                // Assert
                const markdownContainer = rootElement.querySelector('.nlux_cht_itm_in .nlux-md-cntr');
                expect(markdownContainer).toBeInTheDocument();

                const link = markdownContainer!.querySelector('a');
                expect(link).toBeInTheDocument();
                expect(link!.getAttribute('target')).toBe('_blank');
            });
        });
    });
});
