import {
    AiChat,
    FetchResponseComponentProps,
    ResponseComponent,
    StreamResponseComponentProps,
} from '@nlux-dev/react/src';
import {render, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {act, FC} from 'react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForMdStreamToComplete, waitForReactRenderCycle} from '../../../../utils/wait';

describe('<AiChat /> + messageOptions + responseComponent', () => {
    let adapterController: AdapterController | undefined = undefined;

    describe('When a response component is used in fetch mode', () => {
        beforeEach(() => {
            adapterController = adapterBuilder()
                .withFetchText(true)
                .withStreamText(false)
                .create();
        });

        afterEach(() => {
            adapterController = undefined;
        });

        it('Should render the custom component', async () => {
            // Arrange
            const CustomResponseComponent: FC<FetchResponseComponentProps<string>> = ({content}) => (
                <div>The AI response is: {content}</div>
            );

            const {container} = render(
                <AiChat
                    adapter={adapterController!.adapter}
                    messageOptions={{responseComponent: CustomResponseComponent}}
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
            const responseElement = container.querySelector('.nlux_cht_itm_in');
            expect(responseElement!.innerHTML).toEqual(
                expect.stringContaining('<div>The AI response is: Yo!</div>'),
            );
        });

        it('Should pass uid to the custom component', async () => {
            // Arrange
            const CustomResponseComponent: FC<FetchResponseComponentProps<string>> = ({content, uid}) => (
                <div>
                    The AI response is: {content} with uid: {uid}
                </div>
            );

            const customResponseComponentSpy = vi.fn(CustomResponseComponent);

            const {container} = render(
                <AiChat
                    adapter={adapterController!.adapter}
                    messageOptions={{responseComponent: customResponseComponentSpy}}
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
                    dataTransferMode: 'fetch',
                    status: 'complete',
                    serverResponse: undefined,
                }),
            );
        });

        describe('When the custom response component is removed', () => {
            it('Should render the default response component', async () => {
                // Arrange
                const CustomResponseComponent: FC<FetchResponseComponentProps<string>> = ({content, uid}) => (
                    <div>The AI response is: {content} with uid: {uid}</div>
                );

                const customResponseComponentSpy = vi.fn(CustomResponseComponent);
                const {container, rerender} = render(<AiChat
                    adapter={adapterController!.adapter}
                    messageOptions={{responseComponent: customResponseComponentSpy}}
                />);
                await waitForReactRenderCycle();

                // Act
                rerender(<AiChat
                    adapter={adapterController!.adapter}
                    messageOptions={{responseComponent: undefined}}
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
                const responseElement = container.querySelector('.nlux_cht_itm_in');
                expect(customResponseComponentSpy).not.toHaveBeenCalled();
                expect(responseElement!.innerHTML).toEqual(
                    expect.stringContaining('Yo!'),
                );
            });
        });
    });

    describe('When a response component is used in stream mode', () => {
        beforeEach(() => {
            adapterController = adapterBuilder()
                .withFetchText(false)
                .withStreamText(true)
                .create();
        });

        afterEach(() => {
            adapterController = undefined;
        });

        it('Should render the markdown in the custom component as it\'s being generated', async () => {
            // Arrange
            const CustomResponseComponent: ResponseComponent<string> = ({
                containerRef,
                uid,
            }: StreamResponseComponentProps<string>) => (
                <div className="some-streamed-response">
                    <div className="content" ref={containerRef}/>
                    <div className="footer">Some footer content</div>
                </div>
            );

            const customResponseComponentSpy = vi.fn(CustomResponseComponent);
            const {container} = render(
                <AiChat
                    adapter={adapterController!.adapter}
                    messageOptions={{responseComponent: customResponseComponentSpy}}
                />,
            );
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
            await waitForReactRenderCycle();

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForReactRenderCycle();

            adapterController!.next('Yo!');
            await act(() => waitForMdStreamToComplete());

            // Assert
            const chatItemReceived = container.querySelector('.nlux-chtRm-cnv-sgmts-cntr .nlux_cht_itm_in');
            const mdContainer = chatItemReceived!.querySelector('.nlux-md-cntr');
            await waitFor(() => {
                expect(mdContainer!.innerHTML).toEqual('<p>Yo!</p>');
            });

            // Act
            adapterController!.next(' What\'s up?');
            await act(() => waitForMdStreamToComplete());

            // Assert - Streamed content should have been appended to the existing content
            await waitFor(() => {
                expect(mdContainer!.innerHTML).toEqual('<p>Yo! What\'s up?</p>');
            });

            // Asset - Custom component should have been called with the correct props
            expect(customResponseComponentSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    uid: expect.any(String),
                    containerRef: expect.objectContaining({current: expect.any(HTMLElement)}),
                }),
                expect.anything(),
            );

            // Assert - Custom component should have rendered with the correct content
            expect(chatItemReceived!.innerHTML).toEqual(
                expect.stringContaining('<div class="some-streamed-response">'));
            expect(chatItemReceived!.innerHTML).toEqual(
                expect.stringContaining('<div class="footer">Some footer content</div>'));
        });
    });
});
