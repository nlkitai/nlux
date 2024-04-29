import {AiChat, ResponseComponent} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForMdStreamToComplete, waitForRenderCycle} from '../../../../utils/wait';

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
            const CustomResponseComponent: ResponseComponent<string> = ({response}) => (
                <div>The AI response is: {response}</div>
            );

            const {container} = render(
                <AiChat
                    adapter={adapterController!.adapter}
                    messageOptions={{responseComponent: CustomResponseComponent}}
                />,
            );
            const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
            await waitForRenderCycle();

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();

            adapterController!.resolve('Yo!');
            await waitForRenderCycle();

            // Assert
            const responseElement = container.querySelector('.nlux_cht_itm_in');
            expect(responseElement!.innerHTML).toEqual(
                expect.stringContaining('<div>The AI response is: Yo!</div>'),
            );
        });

        it('Should pass uid to the custom component', async () => {
            // Arrange
            const CustomResponseComponent: ResponseComponent<string> = ({response, uid}) => (
                <div>
                    The AI response is: {response} with uid: {uid}
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
            await waitForRenderCycle();

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();

            adapterController!.resolve('Yo!');
            await waitForRenderCycle();

            // Assert
            expect(customResponseComponentSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    uid: expect.any(String),
                    response: 'Yo!',
                }),
            );
        });

        describe('When the custom response component is removed', () => {
            it('Should render the default response component', async () => {
                // Arrange
                const CustomResponseComponent: ResponseComponent<string> = ({response, uid}) => (
                    <div>The AI response is: {response} with uid: {uid}</div>
                );

                const customResponseComponentSpy = vi.fn(CustomResponseComponent);
                const {container, rerender} = render(<AiChat
                    adapter={adapterController!.adapter}
                    messageOptions={{responseComponent: customResponseComponentSpy}}
                />);
                await waitForRenderCycle();

                // Act
                rerender(<AiChat
                    adapter={adapterController!.adapter}
                    messageOptions={{responseComponent: undefined}}
                />);
                await waitForRenderCycle();

                const textArea: HTMLTextAreaElement = container.querySelector('.nlux-comp-prmptBox > textarea')!;
                await waitForRenderCycle();

                // Act
                await userEvent.type(textArea, 'Hello{enter}');
                await waitForRenderCycle();

                adapterController!.resolve('Yo!');
                await waitForMdStreamToComplete();

                // Assert
                const responseElement = container.querySelector('.nlux_cht_itm_in');
                expect(customResponseComponentSpy).not.toHaveBeenCalled();
                expect(responseElement!.innerHTML).toEqual(
                    expect.stringContaining('<p>Yo!</p>'),
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
            const CustomResponseComponent: ResponseComponent<string> = ({containerRef, response, uid}) => (
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
            await waitForRenderCycle();

            // Act
            await userEvent.type(textArea, 'Hello{enter}');
            await waitForRenderCycle();

            adapterController!.next('Yo!');
            await waitForMdStreamToComplete();

            // Assert
            const chatItemReceived = container.querySelector('.nlux-chtRm-cnv-sgmts-cntr .nlux_cht_itm_in');
            const mdContainer = chatItemReceived!.querySelector('.nlux-md-cntr');
            expect(mdContainer!.innerHTML).toEqual('<p>Yo!</p>');

            // Act
            adapterController!.next(' What\'s up?');
            await waitForMdStreamToComplete();

            // Assert - Streamed content should have been appended to the existing content
            expect(mdContainer!.innerHTML).toEqual('<p>Yo! What\'s up?</p>');

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
