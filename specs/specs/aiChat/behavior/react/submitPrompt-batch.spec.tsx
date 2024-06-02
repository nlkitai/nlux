import {AiChat} from '@nlux-dev/react/src';
import {render, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForReactRenderCycle} from '../../../../utils/wait';

describe('<AiChat /> + submit prompt + batch adapter', () => {
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
            const activeSegmentSelector = '.nlux-chatRoom-container > .nlux-conversation-container > .nlux-chatSegments-container > .nlux-chatSegment-actv';
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

        it('The prompt should not be removed from the composer', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter}/>;
            const {container} = render(aiChat);
            await waitForReactRenderCycle();
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForReactRenderCycle();

            // Assert
            expect(textArea.value).toBe('Hello');
        });
    });

    describe('When a response is returned', () => {
        it('The active segment should be marked as complete', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter}/>;
            const {container} = render(aiChat);
            await waitForReactRenderCycle();

            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;
            const activeSegmentSelector = '.nlux-chatRoom-container > .nlux-conversation-container > .nlux-chatSegments-container > .nlux-chatSegment';

            await userEvent.type(textArea, 'Hello{enter}');
            await waitForReactRenderCycle();

            // Act
            adapterController!.resolve('Yo!');
            await waitForReactRenderCycle();

            // Assert
            const activeSegment = container.querySelector(activeSegmentSelector);
            expect(activeSegment!.classList.contains('nlux-chatSegment-cmpl')).toBe(true);
            expect(activeSegment!.classList.contains('nlux-chatSegment-actv')).not.toBe(true);
        });

        it('The loader should be removed from the active segment', () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter}/>;
            const {container} = render(aiChat);
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;
            userEvent.type(textArea, 'Hello{enter}');

            // Act
            adapterController!.resolve('Yo!');

            // Assert
            const loaderContainer = container.querySelector('.nlux-chatSegment-loader-container');
            expect(loaderContainer).not.toBeInTheDocument();
        });

        it('The prompt should be removed from the composer', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter}/>;
            const {container} = render(aiChat);
            await waitForReactRenderCycle();

            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForReactRenderCycle();

            // Act
            adapterController!.resolve('Yo!');
            await waitForReactRenderCycle();

            // Assert
            expect(textArea.value).toBe('');
        });
    });

    describe('When the fetch prompt submission fails', () => {
        it('The active segment should be removed', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter}/>;
            const {container} = render(aiChat);
            await waitForReactRenderCycle();

            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForReactRenderCycle();

            // Act
            adapterController?.reject('Sorry user!');
            await waitForReactRenderCycle();

            // Assert
            const activeSegmentSelector = '.nlux-chatRoom-container > .nlux-conversation-container > .nlux-chatSegments-container > .nlux-chatSegment-actv';
            const activeSegment = container.querySelector(activeSegmentSelector);
            expect(activeSegment).not.toBeInTheDocument();
        });

        it('Complete segments should not be removed', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter}/>;
            const {container} = render(aiChat);
            await waitForReactRenderCycle();

            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;
            const activeSegmentSelector = '.nlux-chatRoom-container > .nlux-conversation-container > .nlux-chatSegments-container > .nlux-chatSegment-actv';
            const completeSegmentSelector = '.nlux-chatRoom-container > .nlux-conversation-container > .nlux-chatSegments-container > .nlux-chatSegment-cmpl';

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForReactRenderCycle();

            adapterController?.resolve('Hi! How can I help you?');
            await waitForReactRenderCycle();

            // Assert
            const completeSegment = container.querySelector(completeSegmentSelector);
            expect(completeSegment).toBeInTheDocument();

            // Act again
            await userEvent.type(textArea, 'How are you?{enter}');
            await waitForReactRenderCycle();

            adapterController?.reject('Sorry user!');
            await waitForReactRenderCycle();

            // Assert
            const completeSegmentAgain = container.querySelector(completeSegmentSelector);
            const activeSegment = container.querySelector(activeSegmentSelector);

            expect(completeSegmentAgain).toBeInTheDocument();
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
            adapterController?.reject('Sorry user!');

            // Assert
            await waitFor(() => expect(textArea.value).toBe('Hello'));
        });
    });
});
