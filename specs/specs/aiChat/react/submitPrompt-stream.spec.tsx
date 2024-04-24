import {AiChat} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {waitForMilliseconds, waitForRenderCycle} from '../../../utils/wait';

describe('<AiChat /> + submit prompt + stream adapter', () => {
    let adapterController: AdapterController | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder()
            .withFetchText(false)
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
            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();

            // Assert
            const activeSegmentSelector = '.nlux-chtRm-cntr > .nlux-chtRm-cnv-cntr > .nlux-chtRm-cnv-sgmts-cntr > .nlux-chtSgm-actv';
            const activeSegment = container.querySelector(activeSegmentSelector);
            expect(activeSegment).toBeInTheDocument();
        });

        it('Should show a loader in the active segment', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter}/>;
            const {container} = render(aiChat);
            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();

            // Assert
            const loaderContainer = container.querySelector('.nlux-chtSgm-ldr-cntr');
            expect(loaderContainer).toBeInTheDocument();
        });
    });

    describe('When the adapter starts streaming', () => {
        it('Should stream the text to the active segment', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter}/>;
            const {container} = render(aiChat);
            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();

            adapterController?.next('Hi!');
            await waitForMilliseconds(100);

            // Assert
            const activeSegmentSelector = '.nlux-chtSgm-actv';
            const activeSegment = container.querySelector(activeSegmentSelector);
            expect(activeSegment!.textContent).toContain('Hi!');
        });

        it('Should display loader while streaming', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter}/>;
            const {container} = render(aiChat);
            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();

            adapterController?.next('Hi!');
            await waitForMilliseconds(100);

            // Assert
            const loaderSelector = '.nlux-chtSgm-actv > .nlux-chtSgm-ldr-cntr';
            const loader = container.querySelector(loaderSelector);
            expect(loader).toBeInTheDocument();
        });

        it('Should reset the prompt box', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter}/>;
            const {container} = render(aiChat);
            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();

            adapterController?.next('Hi!');
            await waitForMilliseconds(100);

            // Assert
            expect(textArea.value).toBe('');
        });

        it('Should keep submit button disabled when user types', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter}/>;
            const {container} = render(aiChat);
            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();

            adapterController?.next('Hi!');
            await waitForMilliseconds(100);

            await userEvent.type(textArea, 'So?');
            await waitForRenderCycle();

            // Assert
            const promptBox = container.querySelector('.nlux-comp-prmptBox')!;
            const sendButton = container.querySelector('.nlux-comp-prmptBox > button')!;
            expect(promptBox).toHaveClass('nlux-prmpt-waiting');
            expect(sendButton).toBeDisabled();
        });
    });

    describe('When streaming is complete', () => {
        it('The active segment should be marked as complete', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter}/>;
            const {container} = render(aiChat);
            await waitForRenderCycle();

            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
            const activeSegmentSelector = '.nlux-chtRm-cntr > .nlux-chtRm-cnv-cntr > .nlux-chtRm-cnv-sgmts-cntr > .nlux-chtSgm';

            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();

            adapterController?.next('Hi!');
            await waitForRenderCycle();

            // Act
            adapterController!.complete();
            await waitForRenderCycle();

            // Assert
            const activeSegment = container.querySelector(activeSegmentSelector);
            expect(activeSegment!.classList.contains('nlux-chtSgm-cmpl')).toBe(true);
            expect(activeSegment!.classList.contains('nlux-chtSgm-actv')).not.toBe(true);
        });

        it('The loader should be removed from the active segment', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter}/>;
            const {container} = render(aiChat);
            await waitForRenderCycle();

            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
            const loaderSelector = '.nlux-chtSgm-actv > .nlux-chtSgm-ldr-cntr';

            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();

            adapterController?.next('Hi!');
            await waitForRenderCycle();

            // Act
            adapterController!.complete();
            await waitForRenderCycle();

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
            await waitForRenderCycle();

            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();

            // Act
            adapterController?.error(new Error('An error occurred'));
            await waitForRenderCycle();

            // Assert
            const activeSegmentSelector = '.nlux-chtRm-cntr > .nlux-chtRm-cnv-cntr > .nlux-chtRm-cnv-sgmts-cntr > .nlux-chtSgm-actv';
            const activeSegment = container.querySelector(activeSegmentSelector);
            expect(activeSegment).not.toBeInTheDocument();
        });

        it('The prompt should be restored to the prompt box', async () => {
            // Arrange
            const aiChat = <AiChat adapter={adapterController!.adapter}/>;
            const {container} = render(aiChat);
            await waitForRenderCycle();

            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();

            // Act
            adapterController?.error(new Error('An error occurred'));
            await waitForRenderCycle();

            // Assert
            expect(textArea.value).toBe('Hello');
        });
    });
});
