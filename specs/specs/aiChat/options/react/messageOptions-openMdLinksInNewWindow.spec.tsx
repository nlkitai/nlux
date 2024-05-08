import {AiChat} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForRenderCycle} from '../../../../utils/wait';

describe('<AiChat /> + messageOptions + openMdLinksInNewWindow', () => {
    let adapterController: AdapterController | undefined = undefined;

    beforeEach(() => {
        adapterController = adapterBuilder()
            .withFetchText(true)
            .withStreamText(false)
            .create();
    });

    afterEach(() => {
        adapterController = undefined;
    });

    describe('When openMdLinksInNewWindow is not set', () => {
        it('Markdown links should open in a new window', async () => {
            const aiChat = (
                <AiChat
                    adapter={adapterController!.adapter}
                />
            );
            const {container} = render(aiChat);
            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;

            await userEvent.type(textArea, 'Give me a link please{enter}');
            await waitForRenderCycle();

            // Act
            adapterController!.resolve('Click [here](https://example.com)');
            await waitForRenderCycle();

            // Assert
            const markdownContainer = container.querySelector('.nlux_cht_itm_in .nlux-md-cntr');
            expect(markdownContainer).toBeInTheDocument();

            const link = markdownContainer!.querySelector('a');
            expect(link).toBeInTheDocument();
            expect(link!.getAttribute('target')).toBe('_blank');
        });

        describe('When openMdLinksInNewWindow is updated to true after mounting', () => {
            it('Markdown links should still open in a new window', async () => {
                // Arrange
                const aiChat = (
                    <AiChat
                        adapter={adapterController!.adapter}
                    />
                );
                const {container, rerender} = render(aiChat);
                await waitForRenderCycle();
                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;

                await userEvent.type(textArea, 'Give me a link please{enter}');
                await waitForRenderCycle();

                // Act
                rerender(
                    <AiChat
                        adapter={adapterController!.adapter}
                        messageOptions={{openMdLinksInNewWindow: true}}
                    />,
                );
                await waitForRenderCycle();

                adapterController!.resolve('Click [here](https://example.com)');
                await waitForRenderCycle();

                // Assert
                const markdownContainer = container.querySelector('.nlux_cht_itm_in .nlux-md-cntr');
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
            const aiChat = (
                <AiChat
                    adapter={adapterController!.adapter}
                    messageOptions={{openMdLinksInNewWindow: true}}
                />
            );
            const {container} = render(aiChat);
            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;

            await userEvent.type(textArea, 'Give me a link please{enter}');
            await waitForRenderCycle();

            // Act
            adapterController!.resolve('Click [here](https://example.com)');
            await waitForRenderCycle();

            // Assert
            const markdownContainer = container.querySelector('.nlux_cht_itm_in .nlux-md-cntr');
            expect(markdownContainer).toBeInTheDocument();

            const link = markdownContainer!.querySelector('a');
            expect(link).toBeInTheDocument();
            expect(link!.getAttribute('target')).toBe('_blank');
        });

        describe('When openMdLinksInNewWindow is updated to false after mounting', () => {
            it('Markdown links should not open in a new window', async () => {
                // Arrange
                const aiChat = (
                    <AiChat
                        adapter={adapterController!.adapter}
                        messageOptions={{openMdLinksInNewWindow: true}}
                    />
                );
                const {container, rerender} = render(aiChat);
                await waitForRenderCycle();
                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;

                await userEvent.type(textArea, 'Give me a link please{enter}');
                await waitForRenderCycle();

                // Act
                rerender(
                    <AiChat
                        adapter={adapterController!.adapter}
                        messageOptions={{openMdLinksInNewWindow: false}}
                    />,
                );
                await waitForRenderCycle();

                adapterController!.resolve('Click [here](https://example.com)');
                await waitForRenderCycle();

                // Assert
                const markdownContainer = container.querySelector('.nlux_cht_itm_in .nlux-md-cntr');
                expect(markdownContainer).toBeInTheDocument();

                const link = markdownContainer!.querySelector('a');
                expect(link).toBeInTheDocument();
                expect(link!.getAttribute('target')).toBeNull();
            });
        });
    });

    describe('When openMdLinksInNewWindow is set to false', () => {
        it('Markdown links should not open in a new window', async () => {
            const aiChat = (
                <AiChat
                    adapter={adapterController!.adapter}
                    messageOptions={{openMdLinksInNewWindow: false}}
                />
            );
            const {container} = render(aiChat);
            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;

            await userEvent.type(textArea, 'Give me a link please{enter}');
            await waitForRenderCycle();

            // Act
            adapterController!.resolve('Click [here](https://example.com)');
            await waitForRenderCycle();

            // Assert
            const markdownContainer = container.querySelector('.nlux_cht_itm_in .nlux-md-cntr');
            expect(markdownContainer).toBeInTheDocument();

            const link = markdownContainer!.querySelector('a');
            expect(link).toBeInTheDocument();
            expect(link!.getAttribute('target')).toBeNull();
        });
    });
});
