import {AiChat, AiChatUI} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForReactRenderCycle} from '../../../../utils/wait';

describe('<AiChat /> + UI overrides + loader', () => {
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

    describe('A UI override for the loader is provided', () => {
        it('Should show the user-provided loader', async () => {
            // Arrange
            const aiChat = (
                <AiChat adapter={adapterController!.adapter}>
                    <AiChatUI.Loader>
                        <div className="custom-loader">Custom Loader 👻</div>
                    </AiChatUI.Loader>
                </AiChat>
            );

            const {container} = render(aiChat);
            await waitForReactRenderCycle();
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForReactRenderCycle();

            // Assert
            const composerOldLoader = container.querySelector('.nlux-comp-composer .nlux-comp-loaderContainer') as HTMLDivElement | undefined;
            const composerNewLoader = container.querySelector('.nlux-comp-composer .custom-loader') as HTMLDivElement | undefined;
            const messageOldLoader = container.querySelector('.nlux-chatSegment .nlux-comp-loaderContainer') as HTMLDivElement | undefined;
            const messageNewLoader = container.querySelector('.nlux-chatSegment .custom-loader') as HTMLDivElement | undefined;

            expect(composerOldLoader).not.toBeInTheDocument();
            expect(composerNewLoader).toBeInTheDocument();

            expect(messageOldLoader).not.toBeInTheDocument();
            expect(messageNewLoader).toBeInTheDocument();
        });

        describe('When the user-provided loader changes while a message is loading', () => {
            it('Should show the new loader', async () => {
                // Arrange
                const aiChat = (
                    <AiChat adapter={adapterController!.adapter}>
                        <AiChatUI.Loader>
                            <div className="custom-loader">Custom Loader</div>
                        </AiChatUI.Loader>
                    </AiChat>
                );

                const {container, rerender} = render(aiChat);
                await waitForReactRenderCycle();
                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;
                await userEvent.type(textArea, 'Hello{enter}');
                await waitForReactRenderCycle();

                // Act
                rerender(
                    <AiChat adapter={adapterController!.adapter}>
                        <AiChatUI.Loader>
                            <div className="new-loader">New Loader</div>
                        </AiChatUI.Loader>
                    </AiChat>,
                );
                await waitForReactRenderCycle();

                // Assert
                const composerOldLoader = container.querySelector('.nlux-comp-composer .nlux-comp-loaderContainer') as HTMLDivElement | undefined;
                const composerNewLoader = container.querySelector('.nlux-comp-composer .new-loader') as HTMLDivElement | undefined;

                const messageOldLoader = container.querySelector('.nlux-chatSegment .nlux-comp-loaderContainer') as HTMLDivElement | undefined;
                const messageNewLoader = container.querySelector('.nlux-chatSegment .new-loader') as HTMLDivElement | undefined;

                expect(composerOldLoader).not.toBeInTheDocument();
                expect(composerNewLoader).toBeInTheDocument();

                expect(messageOldLoader).not.toBeInTheDocument();
                expect(messageNewLoader).toBeInTheDocument();
            });
        });

        describe('When the user-provided loader is removed while a message is loading', () => {
            it('Should show the default loader', async () => {
                // Arrange
                const aiChat = (
                    <AiChat adapter={adapterController!.adapter}>
                        <AiChatUI.Loader>
                            <div className="custom-loader">Custom Loader</div>
                        </AiChatUI.Loader>
                    </AiChat>
                );

                const {container, rerender} = render(aiChat);
                await waitForReactRenderCycle();
                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;
                await userEvent.type(textArea, 'Hello{enter}');
                await waitForReactRenderCycle();

                // Act
                rerender(<AiChat adapter={adapterController!.adapter}/>);
                await waitForReactRenderCycle();

                // Assert
                const composerDefaultLoader = container.querySelector('.nlux-comp-composer .nlux-comp-loaderContainer') as HTMLDivElement | undefined;
                const composerCustomLoader = container.querySelector('.nlux-comp-composer .custom-loader') as HTMLDivElement | undefined;

                const messageDefaultLoader = container.querySelector('.nlux-chatSegment .nlux-comp-loaderContainer') as HTMLDivElement | undefined;
                const messageCustomLoader = container.querySelector('.nlux-chatSegment .custom-loader') as HTMLDivElement | undefined;

                expect(composerDefaultLoader).toBeInTheDocument();
                expect(composerCustomLoader).not.toBeInTheDocument();
                expect(messageDefaultLoader).toBeInTheDocument();
                expect(messageCustomLoader).not.toBeInTheDocument();
            });
        });
    });

    describe('When the provided loader is not wrapped in <AiChatUI.Loader>', () => {
        it('The default loader should be used', async () => {
            // Arrange
            const aiChat = (
                <AiChat adapter={adapterController!.adapter}>
                    <div className="custom-loader">Custom Loader</div>
                </AiChat>
            );

            const {container} = render(aiChat);
            await waitForReactRenderCycle();
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForReactRenderCycle();

            // Assert
            const composerDefaultLoader = container.querySelector('.nlux-comp-composer .nlux-comp-loaderContainer') as HTMLDivElement | undefined;
            const composerCustomLoader = container.querySelector('.nlux-comp-composer .custom-loader') as HTMLDivElement | undefined;

            const messageDefaultLoader = container.querySelector('.nlux-chatSegment .nlux-comp-loaderContainer') as HTMLDivElement | undefined;
            const messageCustomLoader = container.querySelector('.nlux-chatSegment .custom-loader') as HTMLDivElement | undefined;

            expect(composerDefaultLoader).toBeInTheDocument();
            expect(composerCustomLoader).not.toBeInTheDocument();

            expect(messageDefaultLoader).toBeInTheDocument();
            expect(messageCustomLoader).not.toBeInTheDocument();
        });
    });
});
