import {AiChat, useAsRscAdapter} from '@nlux-dev/react/src';
import {render, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {act} from 'react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForMilliseconds, waitForReactRenderCycle} from '../../../../utils/wait';

// Skipping as useAsRscAdapter is not included in the public GitHub repository.
describe.skip('<AiChat /> + submit prompt + server component adapter', () => {
    let adapterController: AdapterController | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder()
            .withStreamServerComponent(true)
            .withBatchText(false)
            .withStreamText(false)
            .create();
    });

    afterEach(() => {
        adapterController = undefined;
    });

    describe('When a prompt is submitted', () => {
        it('Should show an active segment', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter}/>;
            const {container} = render(aiChat);
            await waitForReactRenderCycle();
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForReactRenderCycle();

            // Assert
            const activeSegmentSelector = '.nlux-chatRoom-container > .nlux-conversation-container > .nlux-chatSegments-container > .nlux-chatSegment--active';
            const activeSegment = container.querySelector(activeSegmentSelector);
            expect(activeSegment).toBeInTheDocument();
        });

        it('Should show a loader in the active segment', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter}/>;
            const {container} = render(aiChat);
            await waitForReactRenderCycle();
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForReactRenderCycle();

            // Assert
            const loaderContainer = container.querySelector('.nlux-chatSegment-loader-container');
            expect(loaderContainer).toBeInTheDocument();
        });
    });

    describe('When the adapter starts streaming', () => {
        it('Should stream the component to the active segment', async () => {
            // Arrange
            const rscAdapter = useAsRscAdapter(
                Promise.resolve({default: () => <div>HiXxx!</div>}),
            );

            const aiChat = <AiChat adapter={rscAdapter}/>;
            const {container} = render(aiChat);
            await waitForReactRenderCycle();
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForReactRenderCycle();

            // Assert
            const activeSegmentSelector = '.nlux-chatSegment--active';
            const activeSegment = container.querySelector(activeSegmentSelector);
            await waitFor(() => expect(activeSegment!.textContent).toContain('HiXxx!'));
        });

        it('Should display loader while streaming', async () => {
            // Arrange
            const rscAdapter = useAsRscAdapter(
                Promise.resolve({
                    default: async () => {
                        await waitForMilliseconds(10000);
                        return <div>HiXxx!</div>;
                    },
                }),
            );
            const aiChat = <AiChat adapter={rscAdapter}/>;
            const {container} = render(aiChat);
            await waitForReactRenderCycle();
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForReactRenderCycle();

            adapterController?.next('Hi!');
            await act(() => waitForMilliseconds(100));

            // Assert
            const loaderSelector = '.nlux-chatSegment--active > .nlux-chatSegment-loader-container';
            const loader = container.querySelector(loaderSelector);
            expect(loader).toBeInTheDocument();

            const activeSegmentSelector = '.nlux-chatSegment--active';
            const activeSegment = container.querySelector(activeSegmentSelector);
            expect(activeSegment!.textContent).not.toContain('HiXxx!');
        });

        it('Should reset the composer', async () => {
            // Arrange
            const rscAdapter = useAsRscAdapter(
                Promise.resolve({default: () => <div>HiXxx!</div>}),
            );
            const aiChat = <AiChat adapter={rscAdapter}/>;
            const {container} = render(aiChat);
            await waitForReactRenderCycle();
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForReactRenderCycle();

            adapterController?.next('Hi!');
            await act(() => waitForMilliseconds(100));

            // Assert
            expect(textArea.value).toBe('');
        });
    });

    describe('When streaming is complete', () => {
        it('The active segment should be marked as complete', async () => {
            // Arrange
            const rscAdapter = useAsRscAdapter(
                Promise.resolve({default: () => <div>HiXxx!</div>}),
            );
            const aiChat = <AiChat adapter={rscAdapter}/>;
            const {container} = render(aiChat);
            await waitForReactRenderCycle();

            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;
            const activeSegmentSelector = '.nlux-chatRoom-container > .nlux-conversation-container > .nlux-chatSegments-container > .nlux-chatSegment';

            await userEvent.type(textArea, 'Hello{enter}');
            await waitForReactRenderCycle();

            // Act
            await act(() => waitForReactRenderCycle());

            // Assert
            const activeSegment = container.querySelector(activeSegmentSelector);
            await waitFor(() => expect(activeSegment!.classList.contains('nlux-chatSegment--complete')).toBe(true));
            await waitFor(() => expect(activeSegment!.classList.contains('nlux-chatSegment--active')).not.toBe(true));
        });

        it('The loader should be removed from the active segment', async () => {
            // Arrange
            const rscAdapter = useAsRscAdapter(
                Promise.resolve({default: () => <div>HiXxx!</div>}),
            );
            const aiChat = <AiChat adapter={rscAdapter}/>;
            const {container} = render(aiChat);
            await waitForReactRenderCycle();

            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;
            const loaderSelector = '.nlux-chatSegment--active > .nlux-chatSegment-loader-container';

            await userEvent.type(textArea, 'Hello{enter}');
            await waitForReactRenderCycle();

            adapterController?.next('Hi!');
            await act(() => waitForReactRenderCycle());

            // Act
            adapterController!.complete();
            await act(() => waitForReactRenderCycle());

            // Assert
            const loader = container.querySelector(loaderSelector);
            expect(loader).not.toBeInTheDocument();
        });
    });

    describe('When a streaming error occurs', () => {
        it('The active segment should be removed', async () => {
            // Arrange
            const createAdapter = useAsRscAdapter;
            let rscAdapter;
            try {
                rscAdapter = createAdapter(new Promise((resolve, reject) => {
                    setTimeout(() => reject(new Error('An error occurred')), 100);
                }));
            } catch (_e) {
                // Ignore
            }

            const aiChat = <AiChat adapter={rscAdapter!}/>;
            const {container} = render(aiChat);
            await waitForReactRenderCycle();

            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForReactRenderCycle();

            // Act
            adapterController?.error(new Error('An error occurred'));
            await act(() => waitForReactRenderCycle());

            // Assert
            const activeSegmentSelector = '.nlux-chatRoom-container > .nlux-conversation-container > .nlux-chatSegments-container > .nlux-chatSegment--active';
            const activeSegment = container.querySelector(activeSegmentSelector);
            await waitFor(() => expect(activeSegment).not.toBeInTheDocument());
        });

        it('The prompt should be restored to the composer', async () => {
            // Arrange
            const rscAdapter = useAsRscAdapter(new Promise((resolve, reject) => {
                setTimeout(() => reject(new Error('An error occurred')), 100);
            }));
            const aiChat = <AiChat adapter={rscAdapter}/>;
            const {container} = render(aiChat);
            await waitForReactRenderCycle();

            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForReactRenderCycle();

            // Act
            adapterController?.error(new Error('An error occurred'));
            await act(() => waitForReactRenderCycle());

            // Assert
            await waitFor(() => expect(textArea.value).toBe('Hello'));
        });
    });

    describe('When the RSC is an async component', () => {
        it('Should await and render the RSC', async () => {
            // Arrange
            const rscAdapter = useAsRscAdapter(
                Promise.resolve({
                    default: async () => {
                        await waitForMilliseconds(500);
                        return <div>HiXxx!</div>;
                    },
                }),
            );
            const aiChat = <AiChat adapter={rscAdapter}/>;
            const {container} = render(aiChat);
            await waitForReactRenderCycle();

            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForReactRenderCycle();

            // Assert
            await waitFor(() => expect(container.textContent).toContain('HiXxx!'));
        });
    });

    describe('When the RSC is a synchronous component', () => {
        it('Should be rendered immediately', async () => {
            // Arrange
            const rscAdapter = useAsRscAdapter(
                Promise.resolve({
                    default: () => <div>HiXxx!</div>,
                }),
            );
            const aiChat = <AiChat adapter={rscAdapter}/>;
            const {container} = render(aiChat);
            await waitForReactRenderCycle();

            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForReactRenderCycle();

            // Assert
            await waitFor(() => expect(container.textContent).toContain('HiXxx!'));
        });
    });

    describe('When the RSC is an invalid component', () => {
        it('Should show an error message', async () => {
            // Arrange
            const rscAdapter = useAsRscAdapter(
                // @ts-ignore
                Promise.resolve({default: 'Invalid'}),
            );
            const aiChat = <AiChat adapter={rscAdapter}/>;
            const {container} = render(aiChat);
            await waitForReactRenderCycle();

            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForReactRenderCycle();

            // Assert
            const exceptionContainer = container.querySelector('.nlux-comp-exceptionItem');
            expect(exceptionContainer).toBeInTheDocument();
            expect(exceptionContainer!.textContent).toContain('Failed to stream server component');

            const activeSegmentSelector = '.nlux-chatRoom-container > .nlux-conversation-container > .nlux-chatSegments-container > .nlux-chatSegment';
            const activeSegment = container.querySelector(activeSegmentSelector);
            expect(activeSegment).not.toBeInTheDocument();
        });
    });
});
