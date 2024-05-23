import {AiChat} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForReactRenderCycle} from '../../../../utils/wait';

describe('<AiChat /> + batch adapter + events + error', () => {
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

    describe('When an error occurs', () => {
        it('It should trigger the error event', async () => {
            // Arrange
            const errorCallback = vi.fn();
            const aiChat = (
                <AiChat
                    adapter={adapterController!.adapter}
                    events={{error: errorCallback}}
                />
            );

            const {container} = render(aiChat);
            await waitForReactRenderCycle();

            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForReactRenderCycle();

            // Act
            adapterController!.reject('Error msg!');
            await waitForReactRenderCycle();

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
            const aiChat = (
                <AiChat
                    adapter={adapterController!.adapter}
                    events={{error: errorCallback1}}
                />
            );

            const {container, rerender} = render(aiChat);
            await waitForReactRenderCycle();

            const textArea1: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
            await userEvent.type(textArea1, 'Hello{enter}');
            await waitForReactRenderCycle();

            // Act
            adapterController!.reject('Error msg!');
            await waitForReactRenderCycle();

            // Assert
            expect(errorCallback1).toHaveBeenCalledWith({
                errorId: 'failed-to-load-content',
                message: 'Failed to load content',
                errorObject: expect.any(Error),
            });

            rerender(
                <AiChat
                    adapter={adapterController!.adapter}
                    events={{error: errorCallback2}}
                />,
            );
            await waitForReactRenderCycle();

            const textArea2: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
            await userEvent.type(textArea2, 'Hello{enter}');
            await waitForReactRenderCycle();

            adapterController!.reject('Error msg!');
            await waitForReactRenderCycle();

            expect(errorCallback1).toHaveBeenCalledTimes(1);
            expect(errorCallback2).toHaveBeenCalledWith({
                errorId: 'failed-to-load-content',
                message: 'Failed to load content',
                errorObject: expect.any(Error),
            });
        });
    });
});
