import {AiChat} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForReactRenderCycle} from '../../../../utils/wait';

describe('<AiChat /> + stream adapter + events + error', () => {
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
            adapterController!.error(new Error('Error msg!'));
            await waitForReactRenderCycle();

            // Assert
            expect(errorCallback).toHaveBeenCalledWith({
                errorId: 'failed-to-stream-content',
                message: 'Failed to stream content',
                errorObject: expect.any(Error),
            });

            const error = errorCallback.mock.calls[0][0].errorObject as Error;
            expect(error.message).toEqual('Error msg!');
        });
    });
});
