import {AiChat, createAiChat} from '@nlux-dev/core/src';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import '@testing-library/jest-dom';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForRenderCycle} from '../../../../utils/wait';

describe('createAiChat() + batch adapter + events + error', () => {
    let adapterController: AdapterController | undefined = undefined;
    let rootElement: HTMLElement;
    let aiChat: AiChat | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder()
            .withBatchText(true)
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

    describe('When an error occurs', () => {
        it('It should trigger the error event', async () => {
            // Arrange
            const errorCallback = vi.fn();
            aiChat = createAiChat()
                .withAdapter(adapterController!.adapter)
                .on('error', errorCallback);

            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();

            // Act
            adapterController!.reject('Error msg!');
            await waitForRenderCycle();

            // Assert
            expect(errorCallback).toHaveBeenCalledWith({
                errorId: 'failed-to-load-content',
                message: 'Failed to load content',
                errorObject: expect.any(Error),
            });

            const error = errorCallback.mock.calls[0][0].errorObject as Error;
            expect(error.message).toEqual('Error msg!');
        });
    });

    describe('When the error callback is updated', () => {
        it('It should trigger the new error callback', async () => {
            // Arrange
            const errorCallback1 = vi.fn();
            const errorCallback2 = vi.fn();
            aiChat = createAiChat()
                .withAdapter(adapterController!.adapter)
                .on('error', errorCallback1);

            aiChat.mount(rootElement);
            await waitForRenderCycle();

            const textArea: HTMLTextAreaElement = rootElement.querySelector('.nlux-comp-prmptBox > textarea')!;
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();

            // Act
            aiChat.removeEventListener('error', errorCallback1);
            aiChat.on('error', errorCallback2);
            adapterController!.reject('Error msg!');
            await waitForRenderCycle();

            // Assert
            expect(errorCallback1).not.toHaveBeenCalled();
            expect(errorCallback2).toHaveBeenCalledWith({
                errorId: 'failed-to-load-content',
                message: 'Failed to load content',
                errorObject: expect.any(Error),
            });

            const error = errorCallback2.mock.calls[0][0].errorObject as Error;
            expect(error.message).toEqual('Error msg!');
        });
    });
});
