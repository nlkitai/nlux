import {AiChat} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForReactRenderCycle} from '../../../../utils/wait';

describe('<AiChat /> + events + messageSent', () => {
    let adapterController: AdapterController | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder().withBatchText().create();
    });

    afterEach(() => {
        adapterController = undefined;
    });

    describe('When a message is sent', () => {
        it('It should trigger the messageSent event', async () => {
            // Arrange
            const messageSentCallback = vi.fn();
            const aiChat = (
                <AiChat
                    adapter={adapterController!.adapter}
                    events={{messageSent: messageSentCallback}}
                />
            );

            const {container} = render(aiChat);
            await waitForReactRenderCycle();
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForReactRenderCycle();

            // Assert
            expect(messageSentCallback).toHaveBeenCalledOnce();
        });

        it('It should pass the message to the callback', async () => {
            // Arrange
            const messageSentCallback = vi.fn();
            const aiChat = (
                <AiChat
                    adapter={adapterController!.adapter}
                    events={{messageSent: messageSentCallback}}
                />
            );

            const {container} = render(aiChat);
            await waitForReactRenderCycle();
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForReactRenderCycle();

            // Assert
            expect(messageSentCallback).toHaveBeenCalledWith({
                uid: expect.any(String),
                message: 'Hello',
            });
        });
    });

    describe('When the event handler is updated', () => {
        it('It should trigger the new event handler', async () => {
            // Arrange
            const messageSentCallback1 = vi.fn();
            const messageSentCallback2 = vi.fn();
            const aiChat = (
                <AiChat
                    adapter={adapterController!.adapter}
                    events={{messageSent: messageSentCallback1}}
                />
            );

            const {container, rerender} = render(aiChat);
            await waitForReactRenderCycle();

            // Act
            rerender(
                <AiChat
                    adapter={adapterController!.adapter}
                    events={{messageSent: messageSentCallback2}}
                />,
            );
            await waitForReactRenderCycle();
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForReactRenderCycle();

            // Assert
            expect(messageSentCallback1).not.toHaveBeenCalled();
            expect(messageSentCallback2).toHaveBeenCalledOnce();
        });
    });
});
