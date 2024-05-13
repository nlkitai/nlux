import {AiChat} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForReactRenderCycle} from '../../../../utils/wait';

describe('<AiChat /> + events + ready', () => {
    let adapterController: AdapterController | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder().withFetchText().create();
    });

    afterEach(() => {
        adapterController = undefined;
    });

    describe('When the component is rendered', () => {
        it('It should trigger the ready event', async () => {
            // Arrange
            const readyCallback = vi.fn();
            const aiChat = (
                <AiChat adapter={adapterController!.adapter} events={{ready: readyCallback}}/>
            );

            // Act
            render(aiChat);
            await waitForReactRenderCycle();

            // Assert
            expect(readyCallback).toHaveBeenCalledOnce();
        });

        it('It should trigger the ready event with the correct details', async () => {
            // Arrange
            const readyCallback = vi.fn();
            const aiChat = (
                <AiChat
                    adapter={adapterController!.adapter}
                    events={{ready: readyCallback}}
                    className="test-class"
                    layoutOptions={{
                        width: '100%',
                        height: 800,
                    }}
                />
            );

            // Act
            render(aiChat);
            await waitForReactRenderCycle();

            // Assert
            expect(readyCallback).toHaveBeenCalledWith({
                aiChatProps: {
                    className: 'test-class',
                    layoutOptions: {
                        width: '100%',
                        height: 800,
                    },
                },
            });
        });
    });

    describe('When the component is rendered without a ready event callback', () => {
        describe('When the ready callback is provided after the component is rendered', () => {
            it('It should not trigger the ready event', async () => {
                // Arrange
                const readyCallback = vi.fn();
                const aiChat = (
                    <AiChat adapter={adapterController!.adapter}/>
                );

                const {rerender} = render(aiChat);
                await waitForReactRenderCycle();

                // Act
                rerender(
                    <AiChat adapter={adapterController!.adapter} events={{ready: readyCallback}}/>,
                );
                await waitForReactRenderCycle();

                // Assert
                expect(readyCallback).not.toHaveBeenCalledOnce();
            });
        });
    });
});
