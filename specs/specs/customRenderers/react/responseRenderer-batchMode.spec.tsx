import {
    AiChat,
    BatchResponseComponentProps,
} from '@nlux-dev/react/src';
import {render, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {act, FC} from 'react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {waitForMdStreamToComplete, waitForReactRenderCycle} from '../../../utils/wait';

describe('<AiChat /> + responseRenderer in batch mode', () => {
    let adapterController: AdapterController | undefined = undefined;

    describe('When a response renderer is used in batch mode', () => {
        beforeEach(() => {
            adapterController = adapterBuilder()
                .withBatchText(true)
                .withStreamText(false)
                .create();
        });

        afterEach(() => {
            adapterController = undefined;
        });

        it('Should render the custom component', async () => {
            // Arrange
            const CustomResponseComponent: FC<BatchResponseComponentProps<string>> = ({content}) => (
                <div>The AI response is: {content}</div>
            );

            const {container} = render(
                <AiChat
                    adapter={adapterController!.adapter}
                    messageOptions={{responseRenderer: CustomResponseComponent}}
                />,
            );
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
            await waitForReactRenderCycle();

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForReactRenderCycle();

            adapterController!.resolve('Yo!');
            await waitForReactRenderCycle();

            // Assert
            const responseElement = container.querySelector('.nlux_cht_itm_rcvd');
            expect(responseElement!.innerHTML).toEqual(
                expect.stringContaining('<div>The AI response is: Yo!</div>'),
            );
        });

        it('Should pass uid to the custom component', async () => {
            // Arrange
            const CustomResponseComponent: FC<BatchResponseComponentProps<string>> = ({content, uid}) => (
                <div>
                    The AI response is: {content} with uid: {uid}
                </div>
            );

            const customResponseComponentSpy = vi.fn(CustomResponseComponent);

            const {container} = render(
                <AiChat
                    adapter={adapterController!.adapter}
                    messageOptions={{responseRenderer: customResponseComponentSpy}}
                />,
            );
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
            await waitForReactRenderCycle();

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForReactRenderCycle();

            adapterController!.resolve('Yo!');
            await waitForReactRenderCycle();

            // Assert
            expect(customResponseComponentSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    uid: expect.any(String),
                    content: 'Yo!',
                    dataTransferMode: 'batch',
                    status: 'complete',
                    serverResponse: undefined,
                }),
            );
        });

        describe('When the custom response renderer is removed', () => {
            it('Should render the default response renderer', async () => {
                // Arrange
                const CustomResponseComponent: FC<BatchResponseComponentProps<string>> = ({content, uid}) => (
                    <div>The AI response is: {content} with uid: {uid}</div>
                );

                const customResponseComponentSpy = vi.fn(CustomResponseComponent);
                const {container, rerender} = render(<AiChat
                    adapter={adapterController!.adapter}
                    messageOptions={{responseRenderer: customResponseComponentSpy}}
                />);
                await waitForReactRenderCycle();

                // Act
                rerender(<AiChat
                    adapter={adapterController!.adapter}
                    messageOptions={{responseRenderer: undefined}}
                />);
                await waitForReactRenderCycle();

                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
                await waitForReactRenderCycle();

                // Act
                await userEvent.type(textArea, 'Hello{enter}');
                await waitForReactRenderCycle();

                adapterController!.resolve('Yo!');
                await act(() => waitForMdStreamToComplete());

                // Assert
                const responseElement = container.querySelector('.nlux_cht_itm_rcvd');
                expect(customResponseComponentSpy).not.toHaveBeenCalled();
                expect(responseElement!.innerHTML).toEqual(
                    expect.stringContaining('Yo!'),
                );
            });
        });
    });
});
