import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {render} from '@testing-library/react';
import {AiChat, AiChatApi, useAiChatApi} from '@nlux-dev/react/src';
import {AdapterController} from '../../../utils/adapters';
import {adapterBuilder} from '../../../utils/adapterBuilder';
import {waitForReactRenderCycle} from '../../../utils/wait';
import {act} from 'react';

describe('<AiChat /> + api + sendMessage', () => {
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

    describe('When a prompt is submitted', () => {
        it('It should be sent to the adapter', async () => {
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
            await act(() => render(<Comp/>));
            await waitForReactRenderCycle();

            // Assert
            expect(apiFromOutside).toBeDefined();

            // Act
            act(() => apiFromOutside!.sendMessage(prompt));
            await waitForReactRenderCycle();

            // Assert
            expect(adapterController!.batchTextMock).toHaveBeenCalledWith(prompt);
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
            expect(() => apiFromOutside!.sendMessage(prompt)).toThrow();
        });
    });
});
