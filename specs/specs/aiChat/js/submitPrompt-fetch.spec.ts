import {AiChat, createAiChat} from '@nlux-dev/core/src';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {waitForRenderCycle} from '../../../utils/wait';

describe('createAiChat() + submit prompt + fetch adapter', () => {
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

    describe('When a prompt is submitted', () => {
        it('Should show an active segment', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();

            // Assert
            const activeSegmentSelector = '.nlux-chtRm-cntr > .nlux-chtRm-cnv-cntr > .nlux-chtRm-cnv-sgmts-cntr > .nlux-chtSgm-actv';
            const activeSegment = rootElement.querySelector(activeSegmentSelector);
            expect(activeSegment).toBeInTheDocument();
        });

        it('Should show a loader in the active segment', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();

            // Assert
            const loaderSelector = '.nlux-chtSgm-actv > .nlux-chtSgm-ldr-cntr';
            const loader = rootElement.querySelector(loaderSelector);
            expect(loader).toBeInTheDocument();
        });
    });

    describe('When a response is returned', () => {
        it('The active segment should be marked as complete', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
            const activeSegmentSelector = '.nlux-chtRm-cntr > .nlux-chtRm-cnv-cntr > .nlux-chtRm-cnv-sgmts-cntr > .nlux-chtSgm';

            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();

            // Act
            adapterController!.resolve('Yo!');
            await waitForRenderCycle();

            // Assert
            const activeSegment = rootElement.querySelector(activeSegmentSelector);
            expect(activeSegment!.classList.contains('nlux-chtSgm-cmpl')).toBe(true);
            expect(activeSegment!.classList.contains('nlux-chtSgm-actv')).not.toBe(true);
        });

        it('The loader should be removed from the active segment', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
            const loaderSelector = '.nlux-chtSgm-actv > .nlux-chtSgm-ldr-cntr';

            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();

            // Act
            adapterController!.resolve('Yo!');
            await waitForRenderCycle();

            // Assert
            const loader = rootElement.querySelector(loaderSelector);
            expect(loader).not.toBeInTheDocument();
        });
    });

    describe('When the fetch prompt submission fails', () => {
        it('The active segment should be removed', async () => {
            // Arrange
            aiChat = createAiChat().withAdapter(adapterController!.adapter);
            aiChat.mount(rootElement);
            await waitForRenderCycle();
            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();

            // Act
            adapterController?.reject('Sorry user!');
            await waitForRenderCycle();

            // Assert
            const activeSegmentSelector = '.nlux-chtRm-cntr > .nlux-chtRm-cnv-cntr > .nlux-chtRm-cnv-sgmts-cntr > .nlux-chtSgm-actv';
            const activeSegment = rootElement.querySelector(activeSegmentSelector);
            expect(activeSegment).not.toBeInTheDocument();
        });
    });
});
