import {AiChat} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForReactRenderCycle} from '../../../../utils/wait';

describe('<AiChat /> + stream adapter + events + messageReceived', () => {
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

    describe('When a message is received', () => {
        it('It should trigger the messageReceived event', async () => {
            // Arrange
            const messageStreamStartedCallback = vi.fn();
            const aiChat = (
                <AiChat
                    adapter={adapterController!.adapter}
                    events={{messageStreamStarted: messageStreamStartedCallback}}
                />
            );

            const {container} = render(aiChat);
            await waitForReactRenderCycle();

            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-composer > textarea')!;
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForReactRenderCycle();

            // Act
            adapterController!.next('Yo!');
            adapterController!.complete();
            await waitForReactRenderCycle();

            // Assert
            expect(messageStreamStartedCallback).toHaveBeenCalledWith({
                uid: expect.any(String),
            });
        });
    });
});
