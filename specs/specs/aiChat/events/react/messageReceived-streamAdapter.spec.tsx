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
            .withFetchText(false)
            .withStreamText(true)
            .create();
    });

    afterEach(() => {
        adapterController = undefined;
    });

    describe('When a message is received', () => {
        it('It should trigger the messageReceived event', async () => {
            // Arrange
            const messageReceivedCallback = vi.fn();
            const aiChat = (
                <AiChat
                    adapter={adapterController!.adapter}
                    events={{messageReceived: messageReceivedCallback}}
                />
            );

            const {container} = render(aiChat);
            await waitForReactRenderCycle();

            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForReactRenderCycle();

            // Act
            adapterController!.next('Yo!');
            adapterController!.complete();
            await waitForReactRenderCycle();

            // Assert
            expect(messageReceivedCallback).toHaveBeenCalledOnce();
        });

        it('It should pass the message to the callback', async () => {
            // Arrange
            const messageReceivedCallback = vi.fn();
            const aiChat = (
                <AiChat
                    adapter={adapterController!.adapter}
                    events={{messageReceived: messageReceivedCallback}}
                />
            );

            const {container} = render(aiChat);
            await waitForReactRenderCycle();

            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForReactRenderCycle();

            // Act
            adapterController!.next('Yo!');
            adapterController!.next(' How are you?');
            adapterController!.complete();
            await waitForReactRenderCycle();

            // Assert
            expect(messageReceivedCallback).toHaveBeenCalledWith({
                uid: expect.any(String),
                message: ['Yo!', ' How are you?'],
            });
        });
    });
});
