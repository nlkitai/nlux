import {AiChat} from '@nlux-dev/react/src';
import {render, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {act} from 'react';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForMilliseconds, waitForReactRenderCycle} from '../../../../utils/wait';

describe('<AiChat /> + submit prompt + stream adapter', () => {
    let adapterController: AdapterController | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder()
            .withBatchText(false)
            .withStreamText(true)
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
        it('Should stream the text to the active segment', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter}/>;
            const {container} = render(aiChat);
            await waitForReactRenderCycle();
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForReactRenderCycle();
            adapterController?.next('Hi!');

            // Assert
            const activeSegmentSelector = '.nlux-chatSegment--active';
            const activeSegment = container.querySelector(activeSegmentSelector);
            await waitFor(() => expect(activeSegment!.textContent).toContain('Hi!'));
        });

        it('Should display loader while streaming', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter}/>;
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
        });

        it('Should reset the composer', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter}/>;
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

        it('Should show the stop button in the composer', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter}/>;
            const {container} = render(aiChat);
            await waitForReactRenderCycle();
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForReactRenderCycle();

            adapterController?.next('Hi!');
            await act(() => waitForMilliseconds(100));

            await userEvent.type(textArea, 'So?');
            await waitForReactRenderCycle();

            // Assert
            const stopButton = container.querySelector('.nlux-comp-composer .nlux-comp-cancelIcon');
            expect(stopButton).toBeInTheDocument();
            const sendButton = container.querySelector('.nlux-comp-composer > button')!;
            expect(sendButton).not.toBeDisabled();
        });
    });

    describe('When streaming is complete', () => {
        it('The active segment should be marked as complete', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter}/>;
            const {container} = render(aiChat);
            await waitForReactRenderCycle();

            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;
            const activeSegmentSelector = '.nlux-chatRoom-container > .nlux-conversation-container > .nlux-chatSegments-container > .nlux-chatSegment';

            await userEvent.type(textArea, 'Hello{enter}');
            await waitForReactRenderCycle();

            adapterController?.next('Hi!');
            await act(() => waitForReactRenderCycle());

            // Act
            adapterController!.complete();
            await act(() => waitForReactRenderCycle());

            // Assert
            const activeSegment = container.querySelector(activeSegmentSelector);
            expect(activeSegment!.classList.contains('nlux-chatSegment--complete')).toBe(true);
            expect(activeSegment!.classList.contains('nlux-chatSegment--active')).not.toBe(true);
        });

        it('The loader should be removed from the active segment', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter}/>;
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
            const aiChat = <AiChat adapter={adapterController!.adapter}/>;
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
            expect(activeSegment).not.toBeInTheDocument();
        });

        it('The prompt should be restored to the composer', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter}/>;
            const {container} = render(aiChat);
            await waitForReactRenderCycle();

            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForReactRenderCycle();

            // Act
            adapterController?.error(new Error('An error occurred'));
            await act(() => waitForReactRenderCycle());

            // Assert
            expect(textArea.value).toBe('Hello');
        });
    });
});
