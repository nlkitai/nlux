import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {render, waitFor} from '@testing-library/react';
import {AiChat, AiChatApi, useAiChatApi} from '@nlux-dev/react/src';
import {AdapterController} from '../../../utils/adapters';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {waitForReactRenderCycle} from '../../../utils/wait';
import {act} from 'react';

describe('<AiChat /> + api + composer.cancel', () => {
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

    describe('When called while an active request is in progress', () => {
        it('Should cancel the request and remove the last message', async () => {
            // Arrange
            const prompt = 'Hello, World!';
            let apiFromOutside: AiChatApi | undefined = undefined;
            const Comp = () => {
                const api = useAiChatApi();
                apiFromOutside = api;

                return (
                    <AiChat
                        api={api}
                        adapter={adapterController!.adapter}
                    />
                );
            };

            // Act
            const {container} = await act(() => render(<Comp/>));
            await waitForReactRenderCycle();

            // Assert
            const activeSegmentBeforeSend = container.querySelector('.nlux-chatSegment--active');
            expect(activeSegmentBeforeSend).toBeNull();

            // Act
            act(() => apiFromOutside!.composer.send(prompt));
            await waitForReactRenderCycle();

            // Assert
            const activeSegmentSelector = '.nlux-chatSegment--active';
            const activeSegment = container.querySelector(activeSegmentSelector);
            await waitFor(() => expect(activeSegment).toBeInTheDocument());

            // Act
            act(() => apiFromOutside!.composer.cancel());
            await waitForReactRenderCycle();

            // Assert
            const activeSegmentAfterCancel = container.querySelector(activeSegmentSelector);
            expect(activeSegmentAfterCancel).toBeNull();
        });
    });

    describe('When the component is unmounted', () => {
        it('Calling API methods should result in an exception', async () => {
            // Arrange
            const prompt = 'Hello, World!';
            let apiFromOutside: AiChatApi | undefined = undefined;
            const Comp = () => {
                const api = useAiChatApi();
                apiFromOutside = api;

                return (
                    <AiChat
                        api={api}
                        adapter={adapterController!.adapter}
                    />
                );
            };

            // Act
            const {unmount} = await act(() => render(<Comp/>));
            await waitForReactRenderCycle();

            act(() => unmount());
            await waitForReactRenderCycle();

            // Assert
            expect(apiFromOutside).toBeDefined();
            expect(() => apiFromOutside!.composer.send(prompt)).toThrow();
        });
    });
});
