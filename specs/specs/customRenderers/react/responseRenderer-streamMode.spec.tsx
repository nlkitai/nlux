import {
    AiChat,
    ResponseRenderer,
    StreamResponseComponentProps,
} from '@nlux-dev/react/src';
import {render, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {act, FC} from 'react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {AdapterController} from '../../../utils/adapters';
import {waitForMdStreamToComplete, waitForReactRenderCycle} from '../../../utils/wait';

describe('<AiChat /> + responseRenderer in fetch mode', () => {
    let adapterController: AdapterController | undefined = undefined;

    describe('When a response renderer is used in stream mode', () => {
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
            const CustomResponseComponent: ResponseRenderer<string> = ({
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
                    messageOptions={{responseRenderer: customResponseComponentSpy}}
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
