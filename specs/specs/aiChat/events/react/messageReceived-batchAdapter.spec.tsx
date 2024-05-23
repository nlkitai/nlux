import {AiChat} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForReactRenderCycle} from '../../../../utils/wait';

describe('<AiChat /> + batch adapter + events + messageReceived', () => {
    let adapterController: AdapterController | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder().withBatchText().create();
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
            adapterController!.resolve('Yo!');
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
            adapterController!.resolve('Yo!');
            await waitForReactRenderCycle();

            // Assert
            expect(messageReceivedCallback).toHaveBeenCalledWith({
                uid: expect.any(String),
                message: 'Yo!',
            });
        });
    });

    describe('When the callback updates between messages', () => {
        it('It should trigger the messageReceived event with the new callback', async () => {
            // Arrange
            const messageReceivedCallback1 = vi.fn();
            const messageReceivedCallback2 = vi.fn();
            const aiChat = (
                <AiChat
                    adapter={adapterController!.adapter}
                    events={{messageReceived: messageReceivedCallback1}}
                />
            );

            const {container, rerender} = render(aiChat);
            await waitForReactRenderCycle();

            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForReactRenderCycle();

            // Act
            adapterController!.resolve('Yo!');
            await waitForReactRenderCycle();

            // Assert
            expect(messageReceivedCallback1).toHaveBeenCalledWith({
                uid: expect.any(String),
                message: 'Yo!',
            });

            // Arrange
            rerender(
                <AiChat
                    adapter={adapterController!.adapter}
                    events={{messageReceived: messageReceivedCallback2}}
                />,
            );

            await waitForReactRenderCycle();
            const textArea2: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
            await userEvent.type(textArea2, 'Bonjour{enter}');
            await waitForReactRenderCycle();

            // Act
            adapterController!.resolve('Salut!');
            await waitForReactRenderCycle();

            // Assert
            expect(messageReceivedCallback1).toHaveBeenCalledOnce();
            expect(messageReceivedCallback2).toHaveBeenCalledWith({
                uid: expect.any(String),
                message: 'Salut!',
            });
        });
    });
});
